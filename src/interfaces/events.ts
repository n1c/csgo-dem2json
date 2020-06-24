
import * as i from ".";

export interface Event {
  type: string;
  tick: number;
  time: number;
}

export interface BeginNewMatch extends Event {
  players: i.PlayersListShort;
}

export interface BombBeginDefuse extends Event {
  userid: number;
  haskit: boolean;
  player?: i.Player;
}

export interface BombBeginPlant extends Event {
  userid: number;
  site: number;
  player?: i.Player;
}

export interface BombDefused extends Event {
  userid: number;
  site: number;
  player?: i.Player;
}

export interface BombDropped extends Event {
  userid: number;
  entindex: number;
  player?: i.Player;
}

export interface BombExploded extends Event {
  userid: number;
  site: number;
}

export interface BombPickup extends Event {
  userid: number;
  player?: i.Player;
}

export interface BombPlanted extends Event {
  userid: number;
  site: number;
  player?: i.Player;
}

export interface CSWinPanelRound extends Event {
  show_timer_defend: boolean;
  show_timer_attack: boolean;
  timer_time: number;
  final_event: number;
  funfact_token: string;
  funfact_player?: number;
  funfact_data1: number;
  funfact_data2: number;
  funfact_data3: number;
}

export interface FlashbangDetonate extends Event {
  userid: number;
  entityid: number;
  player?: i.Player;
  player_at_throw?: i.Player;
  players_blind: PlayerBlind[];
  position: i.Position;
}

export interface HEGrenadeDetonate extends Event {
  userid: number;
  entityid: number;
  player?: i.Player;
  player_at_throw?: i.Player;
  position: i.Position;
  players_hurt: PlayerHurt[];
}

export interface HLTVChase extends Event {
  target1: number;
  target2: number;
  distance: number;
  theta: number;
  phi: number;
  inertia: number;
  ineye: number;
}

export interface HLTVStatus extends Event {
  clients: number;
  slots: number;
  proxies: number;
  master: string;
  externaltotal: number;
  externallinked: number;
}

export interface InfernoExpire extends Event {
  entityid: number;
  position: i.Position;
}

export interface InfernoStartburn extends Event {
  entityid: number;
  player?: i.Player;
  position: i.Position;
}

export interface ItemEquip extends Event {
  userid: number;
  item: string;
  defindex: number;
  canzoom: boolean;
  hassilencer: boolean;
  issilenced: boolean;
  hastracers: boolean;
  weptype: number;
  ispainted: boolean;
  player?: i.Player;
}

export interface ItemPickup extends Event {
  userid: number;
  item: string;
  silent: boolean;
  defindex: number;
  player?: i.Player;
}

export interface ItemRemove extends Event {
  userid: number;
  item: string;
  defindex: number;
  player?: i.Player;
}

export interface OtherDeath extends Event {
  otherid: number;
  othertype: string;
  attacker: number;
  weapon: string;
  weapon_itemid: string;
  weapon_fauxitemid: string;
  weapon_originalowner_xuid: string;
  headshot: boolean;
  penetrated: number;
  player?: i.Player;
}

export interface PlayerBlind extends Event {
  userid: number;
  attacker: number;
  entityid: number;
  blind_duration: number;
  player?: i.Player;
  attacker_player?: i.Player;
}

export interface PlayerDeath extends Event {
  userid: number;
  attacker: number;
  assister: number;
  weapon: string;
  weapon_itemid: string;
  weapon_fauxitemid: string;
  weapon_originalowner_xuid: string;
  headshot: boolean;
  dominated: number;
  revenge: number;
  penetrated: number;
  noreplay: boolean;
  player?: i.Player;
  player_blind: boolean;
  attacker_player?: i.Player;
  attacker_player_blind?: boolean;
  assister_player?: i.Player;
  noscope: boolean;
  thrusmoke: boolean;
  attackerblind: boolean;
}

export interface PlayerDisconnect extends Event {
  userid: number;
  reason: string;
  name: string;
  networkid: string;
  player?: i.Player;
}

export interface PlayerFalldamage extends Event {
  userid: number;
  damage: number;
  player?: i.Player;
}

export interface PlayerFootstep extends Event {
  userid: number;
  player?: i.Player;
}

export interface PlayerHurt extends Event {
  userid: number;
  attacker: number;
  health: number;
  armor: number;
  weapon: string;
  dmg_health: number;
  dmg_armor: number;
  hitgroup: number;
  player?: i.Player;
  attacker_player?: i.Player;
  attacker_is_blind?: boolean;
  player_spotted_attacker?: boolean;
  player_is_blind: boolean;
  attacker_spotted_player?: boolean;
}

export interface PlayerJump extends Event {
  userid: number;
  player?: i.Player;
}

export interface PlayerSpawn extends Event {
  userid: number;
  teamnum: number;
  player?: i.Player;
}

export interface PlayerTeam extends Event {
  userid: number;
  team: number;
  oldteam: number;
  disconnect: boolean;
  autoteam: boolean;
  silent: boolean;
  isbot: boolean;
  player?: i.Player;
}

export interface RoundEnd extends Event {
  winner: number;
  reason: number;
  message: string;
  player_count: number;
  players: i.PlayersListFull;
  round: number;
}

export interface RoundFreezeEnd extends Event {
  round: number;
  players: i.PlayersListFull;
}

export interface RoundOfficiallyEnded extends Event {
  players: i.PlayersListFull;
  round: number;
}

export interface RoundStart extends Event {
  objective: string;
  players: i.PlayersListFull;
  round: number;
  timelimit: number;
}

export interface RoundMVP extends Event {
  userid: number;
  reason: number;
  musickitmvps: number;
  player?: i.Player;
  round: number;
}

export interface SayText extends Event {
  text: string;
}

export interface SayText2 extends Event {
  text: string;
  username: string;
}

export interface SmokegrenadeDetonate extends Event {
  userid: number;
  entityid: number;
  player?: i.Player;
  player_at_throw?: i.Player;
  position: i.Position;
}

export interface SmokegrenadeExpired extends Event {
  userid: number;
  entityid: number;
  player?: i.Player;
  position: i.Position;
}

export interface WeaponFire extends Event {
  userid: number;
  weapon: string;
  silenced: boolean;
  player?: i.Player;
}

export interface WeaponReload extends Event {
  userid: number;
  player?: i.Player;
}

export interface WeaponZoom extends Event {
  userid: number;
  player?: i.Player;
}
