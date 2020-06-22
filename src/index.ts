// @TODO: Buy/Economy events?
// @TODO: player_avenged_teammate
// @TODO: Player matchStats in each round end?

import demofile = require("demofile");
import * as fs from "fs";
import { md5FileSync } from "./md5FileSync";

import * as c from "./constants";
import { Factory } from "./factories";
import { EventFactory } from "./factories/events";
import * as i from "./interfaces";
import * as events from "./interfaces/events";

const log = console.log;

if (process.argv.length < 3) {
  log("Specify the full path to a demo & optional output path");
  log("e.g.: ./index.js ~/test.dem ~/output.json");

  process.exit(1);
}

const demoPath: string = process.argv[2];
const outputPath: string = process.argv.length === 4 ? process.argv[3] : process.argv[2].replace(".dem", ".json");

const demo = new demofile.DemoFile();

console.time("parseDemo");
fs.readFile(demoPath, (err: NodeJS.ErrnoException | null, buffer: Buffer) => {
  if (err) {
    throw err;
  }

  log(`Processing ${demoPath} to ${outputPath}`);
  demo.parse(buffer);
});

// Keeps track of players and when they become unblind (resets between rounds)
let playersUnblindAt: { [userid: number]: number } = {};

// Tracks active grenades for users (resets between rounds)
let grenades: { [userid: number]: { [weaponType: string]: i.Player[] } } = {};

let tickFlashbangDetonate: events.FlashbangDetonate | undefined;
let tickPlayersBlind: events.PlayerBlind[] = [];

let tickHEGrenadeDetonate: events.HEGrenadeDetonate | undefined;
let tickPlayersHEHurt: events.PlayerHurt[] = [];

let demoDump: i.DemoDump;

demo.on("start", () => {
  demoDump = {
    client_name: demo.header.clientName,
    events: [],
    hash: md5FileSync(demoPath),
    map_name: demo.header.mapName,
    network_protocol: demo.header.networkProtocol,
    parsed_at: new Date(),
    parser_name: "dem2json-events",
    parser_version: "0.0.x-dev",
    playback_frames: demo.header.playbackFrames,
    playback_ticks: demo.header.playbackTicks,
    playback_time: demo.header.playbackTime,
    players: {},
    protocol: demo.header.protocol,
    server_name: demo.header.serverName,
    signon_length: demo.header.signonLength,
  };
});

// Top level demo events
demo.on("end", () => {
  console.timeEnd("parseDemo");

  fs.writeFile(
    outputPath,
    JSON.stringify(demoDump, undefined, 2),
    (writeErr: NodeJS.ErrnoException | null) => {
      if (writeErr) {
        throw writeErr;
      }

      log("Output saved: ", outputPath);
    },
  );
});

demo.on("tickend", () => {
  if (tickFlashbangDetonate) {
    tickFlashbangDetonate.players_blind = tickPlayersBlind;
    demoDump.events.push(tickFlashbangDetonate);
  }

  tickFlashbangDetonate = undefined;
  tickPlayersBlind = [];

  if (tickHEGrenadeDetonate) {
    tickHEGrenadeDetonate.players_hurt = tickPlayersHEHurt;
    demoDump.events.push(tickHEGrenadeDetonate);
  }

  tickHEGrenadeDetonate = undefined;
  tickPlayersHEHurt = [];
});

// userMessages

demo.userMessages.on("SayText", (e: any) => {
  demoDump.events.push(EventFactory.SayText(demo, e));
});

demo.userMessages.on("SayText2", (e: any) => {
  demoDump.events.push(EventFactory.SayText2(demo, e));
});

/*
 * gameEvents
 * https://gitlab.com/ghostanalysis/csgo-demo-parser/blob/master/misc/example-events.md
 * https://wiki.alliedmods.net/Counter-Strike:_Global_Offensive_Events
 *
 * Skipped
 * - buytime_ended
 * - item_equip
 * - player_footstep
 * - tournament_reward
 * - weapon_fire_on_empty
 *
 * gameEvents don't seem to get fired
 * - break_prop
 * - break_breakable
 * - bomb_abortdefuse
 * - bomb_abortplant
 * - defuser_dropped
 * - defuser_pickup
 * - entity_killed
 * - grenade_thrown
 * - player_given_c4
 * - inspect_weapon
 * - item_purchase
 * - inferno_extinguish
 * - player_radio
 */

// Some events possibly never fired?
demo.gameEvents.on("item_found", (e: demofile.IEventItemFound) => {
  console.log("item_found", e);
});

demo.gameEvents.on("item_purchase", (e: demofile.IEventItemPurchase) => {
  console.log("item_purchase", e);
})

demo.gameEvents.on("inventory_updated", (e: demofile.IEventInventoryUpdated) => {
  console.log("inventory_updated", e);
});

demo.gameEvents.on("bomb_beep", (e: demofile.IEventBombBeep) => {
  console.log("bomb_beep", e);
});

// Events that do get fired.
demo.gameEvents.on("bomb_begindefuse", (e: demofile.IEventBombBegindefuse) => {
  demoDump.events.push(EventFactory.BombBeginDefuse(demo, e));
});

demo.gameEvents.on("begin_new_match", () => {
  demoDump.players = Factory.PlayersListShort(demo);
  demoDump.events.push(EventFactory.Event("begin_new_match", demo));
});

demo.gameEvents.on("bomb_beginplant", (e: demofile.IEventBombBeginplant) => {
  demoDump.events.push(EventFactory.BombBeginPlant(demo, e));
});

demo.gameEvents.on("bomb_defused", (e: demofile.IEventBombDefused) => {
  demoDump.events.push(EventFactory.BombDefused(demo, e));
});

demo.gameEvents.on("bomb_dropped", (e: demofile.IEventBombDropped) => {
  demoDump.events.push(EventFactory.BombDropped(demo, e));
});

demo.gameEvents.on("bomb_exploded", (e: demofile.IEventBombExploded) => {
  demoDump.events.push(EventFactory.BombExploded(demo, e));
});

demo.gameEvents.on("bomb_pickup", (e: demofile.IEventBombPickup) => {
  demoDump.events.push(EventFactory.BombPickup(demo, e));
});

demo.gameEvents.on("bomb_planted", (e: demofile.IEventBombPlanted) => {
  demoDump.events.push(EventFactory.BombPlanted(demo, e));
});

demo.gameEvents.on("round_announce_match_start", () => {
  demoDump.events.push(EventFactory.Event("round_announce_match_start", demo));
});

demo.gameEvents.on("round_announce_match_point", () => {
  demoDump.events.push(EventFactory.Event("round_announce_match_point", demo));
});

demo.gameEvents.on("round_end", (e: demofile.IEventRoundEnd) => {
  demoDump.events.push(EventFactory.RoundEnd(demo, e));
});

demo.gameEvents.on("round_freeze_end", () => {
  demoDump.events.push(EventFactory.RoundFreezeEnd(demo));
});

demo.gameEvents.on("round_prestart", () => {
  demoDump.events.push(EventFactory.Event("round_prestart", demo));
});

demo.gameEvents.on("round_start", (e: demofile.IEventRoundStart) => {
  demoDump.events.push(EventFactory.RoundStart(demo, e));
});

demo.gameEvents.on("round_poststart", () => {
  demoDump.events.push(EventFactory.Event("round_poststart", demo));
});

demo.gameEvents.on("round_time_warning", () => {
  demoDump.events.push(EventFactory.Event("round_time_warning", demo));
});

demo.gameEvents.on("round_mvp", (e: demofile.IEventRoundMvp) => {
  demoDump.events.push(EventFactory.RoundMVP(demo, e));
});

demo.gameEvents.on("round_announce_last_round_half", () => {
  demoDump.events.push(EventFactory.Event("round_announce_last_round_half", demo));
});

demo.gameEvents.on("round_officially_ended", () => {
  demoDump.events.push(EventFactory.RoundOfficiallyEnded(demo));
  grenades = {};
  playersUnblindAt = {};
});

demo.gameEvents.on("announce_phase_end", () => {
  demoDump.events.push(EventFactory.Event("announce_phase_end", demo));
});

demo.gameEvents.on("weapon_fire", (e: demofile.IEventWeaponFire) => {
  demoDump.events.push(EventFactory.WeaponFire(demo, e));

  if (c.GRENADE_TYPES.indexOf(e.weapon) >= 0) {
    if (!grenades[e.userid]) {
      grenades[e.userid] = {};
    }

    if (!grenades[e.userid][e.weapon]) {
      grenades[e.userid][e.weapon] = [];
    }

    const p: i.Player | undefined = Factory.playerFromUserID(demo, e.userid);
    if (p) {
      grenades[e.userid][e.weapon].push(p);
    }
  }
});

demo.gameEvents.on("weapon_reload", (e: demofile.IEventWeaponReload) => {
  demoDump.events.push(EventFactory.WeaponReload(demo, e));
});

demo.gameEvents.on("weapon_zoom", (e: demofile.IEventWeaponZoom) => {
  demoDump.events.push(EventFactory.WeaponZoom(demo, e));
});

demo.gameEvents.on("cs_pre_restart", () => {
  demoDump.events.push(EventFactory.Event("cs_pre_restart", demo));
});

demo.gameEvents.on("cs_round_final_beep", () => {
  demoDump.events.push(EventFactory.Event("cs_round_final_beep", demo));
});

demo.gameEvents.on("cs_round_start_beep", () => {
  demoDump.events.push(EventFactory.Event("cs_round_start_beep", demo));
});

demo.gameEvents.on("cs_win_panel_match", () => {
  demoDump.events.push(EventFactory.Event("cs_win_panel_match", demo));
});

demo.gameEvents.on("cs_win_panel_round", (e: demofile.IEventCsWinPanelRound) => {
  demoDump.events.push(EventFactory.CSWinPanelRound(demo, e));
});

demo.gameEvents.on("flashbang_detonate", (e: demofile.IEventFlashbangDetonate) => {
  let playerAtThrow;
  if (grenades[e.userid] && grenades[e.userid].weapon_flashbang) {
    playerAtThrow = grenades[e.userid].weapon_flashbang.shift();
  }

  tickFlashbangDetonate = EventFactory.FlashbangDetonate(demo, e, playerAtThrow);
});

demo.gameEvents.on("hegrenade_detonate", (e: demofile.IEventHegrenadeDetonate) => {
  let playerAtThrow;
  if (grenades[e.userid] && grenades[e.userid].weapon_hegrenade) {
    playerAtThrow = grenades[e.userid].weapon_hegrenade.shift();
  }

  tickHEGrenadeDetonate = EventFactory.HEGrenadeDetonate(demo, e, playerAtThrow);
});

demo.gameEvents.on("hltv_chase", (e: demofile.IEventHltvChase) => {
  demoDump.events.push(EventFactory.HLTVChase(demo, e));
});

demo.gameEvents.on("hltv_status", (e: demofile.IEventHltvStatus) => {
  demoDump.events.push(EventFactory.HLTVStatus(demo, e));
});

demo.gameEvents.on("inferno_expire", (e: demofile.IEventInfernoExpire) => {
  demoDump.events.push(EventFactory.InfernoExpire(demo, e));
});

demo.gameEvents.on("inferno_startburn", (e: demofile.IEventInfernoStartburn) => {
  demoDump.events.push(EventFactory.InfernoStartburn(demo, e));
});

demo.gameEvents.on("item_pickup", (e: demofile.IEventItemPickup) => {
  demoDump.events.push(EventFactory.ItemPickup(demo, e));
});

demo.gameEvents.on("item_remove", (e: demofile.IEventItemRemove) => {
  demoDump.events.push(EventFactory.ItemRemove(demo, e));
});

demo.gameEvents.on("other_death", (e: demofile.IEventOtherDeath) => {
  demoDump.events.push(EventFactory.OtherDeath(demo, e));
});

demo.gameEvents.on("player_blind", (e: demofile.IEventPlayerBlind) => {
  const p = demo.entities.getByUserId(e.userid);
  const flashDuration = p ? p.flashDuration : 0;
  playersUnblindAt[e.userid] = demo.currentTime + flashDuration;

  const playerBlind = EventFactory.PlayerBlind(demo, e);
  tickPlayersBlind.push(playerBlind);
  demoDump.events.push(playerBlind);
});

demo.gameEvents.on("player_death", (e: demofile.IEventPlayerDeath) => {
  if (!e.userid) {
    console.error("player_death with no e.userid");
    return;
  }

  demoDump.events.push(EventFactory.PlayerDeath(demo, e, playersUnblindAt));
});

demo.gameEvents.on("player_disconnect", (e: demofile.IEventPlayerDisconnect) => {
  demoDump.events.push(EventFactory.PlayerDisconnect(demo, e));
});

demo.gameEvents.on("player_falldamage", (e: demofile.IEventPlayerFalldamage) => {
  demoDump.events.push(EventFactory.PlayerFalldamage(demo, e));
});

demo.gameEvents.on("player_hurt", (e: demofile.IEventPlayerHurt) => {
  const playerHurt: events.PlayerHurt = EventFactory.PlayerHurt(demo, e, playersUnblindAt);
  demoDump.events.push(playerHurt);

  if (playerHurt.weapon === "hegrenade") {
    tickPlayersHEHurt.push(playerHurt);
  }
});

demo.gameEvents.on("player_jump", (e: demofile.IEventPlayerJump) => {
  demoDump.events.push(EventFactory.PlayerJump(demo, e));
});

demo.gameEvents.on("player_spawn", (e: demofile.IEventPlayerSpawn) => {
  demoDump.events.push(EventFactory.PlayerSpawn(demo, e));
});

demo.gameEvents.on("player_team", (e: demofile.IEventPlayerTeam) => {
  demoDump.events.push(EventFactory.PlayerTeam(demo, e));
});

demo.gameEvents.on("smokegrenade_detonate", (e: demofile.IEventSmokegrenadeDetonate) => {
  let playerAtThrow;
  if (grenades[e.userid] && grenades[e.userid].weapon_smokegrenade) {
    playerAtThrow = grenades[e.userid].weapon_smokegrenade.shift();
  }

  demoDump.events.push(EventFactory.SmokegrenadeDetonate(demo, e, playerAtThrow));
});

demo.gameEvents.on("smokegrenade_expired", (e: demofile.IEventSmokegrenadeExpired) => {
  demoDump.events.push(EventFactory.SmokegrenadeExpired(demo, e));
});
