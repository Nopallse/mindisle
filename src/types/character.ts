export type CharacterId = 'naufal' | 'lauren';

export type Direction = 'down' | 'left' | 'right' | 'up';

export type CharacterActivity = 'idle' | 'walking' | 'observing' | 'resting';

export interface CharacterAttributes {
  energy: number;      // 0 - 100
  curiosity: number;   // 0 - 100
  sociability: number; // 0 - 100
}

export interface CharacterSnapshot {
  id: CharacterId;
  name: string;
  avatarColor: string;
  tileX: number;
  tileY: number;
  worldX: number;
  worldY: number;
  direction: Direction;
  activity: CharacterActivity;
  attributes: CharacterAttributes;
  targetTile?: { x: number; y: number } | null;
}

