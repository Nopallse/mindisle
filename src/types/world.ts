import { CharacterId, CharacterSnapshot } from './character';

export type TileType =
  | 'grass'
  | 'grass_flowers'
  | 'grass_dense'
  | 'path'
  | 'water'
  | 'sand'
  | 'tree'
  | 'rock'
  | 'bush'
  | 'bridge'
  | 'campfire'
  | 'bench'
  | 'well'
  | 'fence'
  | 'signpost'
  | 'garden'
  | 'pier'
  | 'tent'
  | 'lantern'
  | 'shrine';

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  walkable: boolean;
}

export interface WorldTime {
  day: number;
  hour: number;
  minute: number;
  isPaused: boolean;
  speed: number; // 1, 2, 5
}

export interface WorldSnapshot {
  time: WorldTime;
  characters: Record<CharacterId, CharacterSnapshot>;
  mapWidth: number;
  mapHeight: number;
  tileSize: number;
}

