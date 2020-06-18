import * as demofile from "demofile";
import * as i from "../interfaces";

export class Factory {
  public static Player(p: demofile.Player): i.Player {
    return {
      armor: p.armor,
      eye_angles: p.eyeAngles,
      has_helmet: p.hasHelmet,
      health: p.health,
      is_alive: p.isAlive,
      is_scoped: p.isScoped,
      is_spotted: p.isSpotted,
      is_walking: p.isWalking,
      name: p.name,
      place: p.placeName,
      position: p.position,
      steam64_id: p.steam64Id,
      team_number: p.teamNumber,
      userid: p.userId,
      velocity: p.velocity,
    };
  }

  public static PlayerFull(p: demofile.Player): i.PlayerFull {
    return {
      account: p.account,
      armor: p.armor,
      assists: p.assists,
      cash_spend_this_round: p.cashSpendThisRound,
      cash_spend_total: p.cashSpendTotal,
      clan_tag: p.clanTag,
      current_equipment_value: p.currentEquipmentValue,
      deaths: p.deaths,
      eye_angles: p.eyeAngles,
      freeze_time_equipment_value: p.freezeTimeEndEquipmentValue,
      has_c4: p.hasC4,
      has_defuser: p.hasDefuser,
      has_helmet: p.hasHelmet,
      health: p.health,
      is_alive: p.isAlive,
      is_defusing: p.isDefusing,
      is_in_bomb_zone: p.isInBombZone,
      is_in_buy_zone: p.isInBuyZone,
      is_scoped: p.isScoped,
      is_spotted: p.isSpotted,
      is_walking: p.isWalking,
      kills: p.kills,
      // match_stats?
      mvps: p.mvps,
      name: p.name,
      place: p.placeName,
      position: p.position,
      round_start_equipment_value: p.roundStartEquipmentValue,
      score: p.score,
      steam64_id: p.steam64Id,
      steam_id: p.steamId,
      team_number: p.teamNumber,
      userid: p.userId,
      weapons: Factory.Weapons(p.weapons),
    };
  }

  public static PlayersListFull(d: demofile.DemoFile): i.PlayersListFull {
    const players: i.PlayersListFull = {};
    d.players.forEach((p: demofile.Player) => {
      if (p.isFakePlayer || p.isHltv) {
        return;
      }

      players[p.steam64Id] = Factory.PlayerFull(p);
    });

    return players;
  }

  public static PlayersListShort(d: demofile.DemoFile): i.PlayersListShort {
    const players: i.PlayersListShort = {};
    d.players.forEach((p: demofile.Player) => {
      if (p.isFakePlayer || p.isHltv) {
        return;
      }

      players[p.steam64Id] = Factory.PlayerShort(p);
    });

    return players;
  }

  /*
  static PlayersMatchStats(d: DemoFile): { [steam64Id: number]: i.PlayerMatchStats } {
    let players: { [steam64Id: number]: i.PlayerMatchStats } = {};
    d.players.forEach((p: any) => {
      if (p.isFakePlayer || p.isHltv) {
        return;
      }

      players[p.steam64Id] = Factory.PlayerMatchStats(p);
    });

    return players;
  }

  static PlayerMatchStats(p: any): i.PlayerMatchStats {
    return {
      assists: p.matchStats.assists,
      damage: p.matchStats.damage,
      deaths: p.matchStats.deaths,
      equipment_value: p.matchStats.equipmentValue,
      headshot_kills: p.matchStats.headShotKills,
      kills: p.matchStats.kills,
      kill_reward: p.matchStats.killReward,
      live_time: p.matchStats.liveTime,
      money_saved: p.matchStats.moneySaved,
      objective: p.matchStats.objective,
    }
  }
  */

  public static Position(e: any): i.Position {
    return {
      x: e.x,
      y: e.y,
      z: e.z,
    };
  }

  public static RoundNumber(d: demofile.DemoFile): number {
    if (d.gameRules === null) {
      throw new Error(`No gameRules yet: ${d}`);
    }

    return d.gameRules.roundsPlayed + 1;
  }

  public static Weapon(w: any): i.Weapon {
    let prevOwner;
    if (w.prevOwner) {
      prevOwner = Factory.Player(w.prevOwner);
    }

    return {
      class_name: w.className,
      item_name: w.itemName,
      prev_owner: prevOwner,
    };
  }

  public static Weapons(ws: any): i.Weapon[] {
    const weapons: i.Weapon[] = [];
    ws.forEach((w: any) => {
      weapons.push(Factory.Weapon(w));
    });

    return weapons;
  }

  public static PlayerShort(p: any): i.PlayerShort {
    return {
      clan_tag: p.clanTag,
      name: p.name,
      steam64_id: p.steam64Id,
      steam_id: p.steamId,
      userid: p.userId,
    };
  }

  // Helpers
  public static isPlayerBlind(
    d: demofile.DemoFile,
    playersUnblindAt: { [userid: number]: number },
    userid: number,
  ): boolean {
    return !!(playersUnblindAt[userid] && (playersUnblindAt[userid] > d.currentTime));

    /*
    if (playersUnblindAt[userid]) {
      if (playersUnblindAt[userid] > d.currentTime) {
        return true;
      }
    }

    return false;
    */
  }

  public static playerFromUserID(d: demofile.DemoFile, id: number): i.Player | undefined {
    const p = d.entities.getByUserId(id);
    return p ? Factory.Player(p) : undefined;
  }
}
