
import * as events from "./events";

export interface EyeAngles {
  pitch: number;
  yaw: number;
}

export interface DemoDump {
  parser_name: string;
  parser_version: string;
  parsed_at: Date;
  hash: string;
  protocol: number;
  network_protocol: number;
  server_name?: string;
  client_name?: string;
  map_name?: string;
  playback_time: number;
  playback_ticks: number;
  playback_frames: number;
  signon_length: number;

  events: events.Event[];
  players: PlayersListShort;
}

export interface Player {
  armor: number;
  eye_angles: EyeAngles;
  has_helmet: boolean;
  health: number;
  is_alive: boolean;
  is_scoped: boolean;
  is_spotted: boolean;
  is_walking: boolean;
  name: string;
  place: string;
  position: Position;
  steam64_id: string;
  team_number: number;
  userid: number;
  velocity: Position;
}

export interface PlayerFull {
  assists: number;
  armor: number;
  account: number;
  cash_spend_this_round: number;
  cash_spend_total: number;
  current_equipment_value: number;
  clan_tag: string;
  deaths: number;
  eye_angles: EyeAngles;
  freeze_time_equipment_value: number;
  has_c4: boolean;
  has_defuser: boolean;
  has_helmet: boolean;
  health: number;
  is_alive: boolean;
  is_defusing: boolean;
  is_in_bomb_zone: boolean;
  is_in_buy_zone: boolean;
  is_scoped: boolean;
  is_spotted: boolean;
  is_walking: boolean;
  kills: number;
  // match_stats?
  mvps: number;
  name: string;
  place: string;
  position: Position;
  round_start_equipment_value: number;
  score: number;
  steam_id: string;
  steam64_id: string;
  team_number: number;
  userid: number;
  weapons: Weapon[];
}

/*
export interface PlayerMatchStats {
  kills: number,
  damage: number,
  equipment_value: number,
  money_saved: number,
  kill_reward: number,
  live_time: number,
  deaths: number,
  assists: number,
  headshot_kills: number,
  objective: number,
}
*/

export interface PlayersListShort {
  [steam64Id: string]: PlayerShort;
}

export interface PlayersListFull {
  [steam64Id: string]: PlayerFull;
}

export interface PlayerShort {
  clan_tag: string;
  name: string;
  steam_id: string;
  steam64_id: string;
  userid: number;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Weapon {
  item_name: string;
  class_name: string;
  prev_owner?: Player;
}
