import { CharacterId } from './character';

export type WorldEventType = 'SYSTEM' | 'MOVEMENT' | 'TIME' | 'INTERACTION';

export interface WorldEvent {
  id: string;
  timestamp: string;
  worldTime: string;
  type: WorldEventType;
  message: string;
  characterId?: CharacterId;
}

