import { CharacterId } from './character';

export type EpistemicNodeType = 'fact' | 'belief' | 'suspicion';

export interface EpistemicNode {
  id: string;
  characterId: CharacterId;
  subject: string;
  predicate: string;
  object: string;
  confidence: number; // 0.0 to 1.0
  type: EpistemicNodeType;
  source: string; // e.g., 'direct_observation', 'personal_experiment', 'heard_from_lauren'
  createdAt: number;
  lastValidatedAt: number;
}

export interface EpisodicMemory {
  id: string;
  characterId: CharacterId;
  content: string;
  importance: number; // 1 to 10
  emotionalValence: number; // -1.0 to 1.0
  timestamp: number;
  worldDay: number;
  worldHour: number;
  location: { x: number; y: number; landmark: string };
  tags: string[];
}

export interface SemanticReflection {
  id: string;
  characterId: CharacterId;
  summary: string;
  supportingMemoryIds: string[];
  importance: number;
  createdAt: number;
}
