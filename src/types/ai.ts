import { CharacterId, Direction } from './character';

export type ActionType =
  | 'IDLE'
  | 'MOVE'
  | 'GATHER'
  | 'INSPECT'
  | 'SPEAK'
  | 'PROPOSE_INVENTION'
  | 'START_CONSTRUCTION'
  | 'CONSTRUCT_STEP';

export interface SimulatedEmotion {
  valence: number; // -1.0 (negative) to 1.0 (positive)
  arousal: number; // 0.0 (calm) to 1.0 (excited)
  label: string; // e.g. "curious", "frustrated", "satisfied", "calm"
}

export interface ProposedAction {
  type: ActionType;
  targetTile?: { x: number; y: number };
  interactionEntityId?: string;
  dialogue?: string | null;
}

export interface CreativeProposal {
  objectName: string;
  category: 'furniture' | 'tool' | 'structure' | 'decoration' | 'machine';
  inspiration: string;
  estimatedMaterials: Array<{
    materialId: string;
    count: number;
  }>;
}

export interface MemoryCandidate {
  content: string;
  importance: number; // 1 to 10
  confidence: number; // 0.0 to 1.0
}

export interface AgentDecisionProposal {
  schemaVersion: 2;
  requestId: string;
  characterId: CharacterId;
  internalThought: string;
  activeMotivation: string;
  simulatedEmotion: SimulatedEmotion;
  action: ProposedAction;
  creativeProposal?: CreativeProposal;
  memoryCandidate?: MemoryCandidate;
}

export interface AgentPerceptionContext {
  characterId: CharacterId;
  name: string;
  worldTime: { day: number; hour: number; minute: number; isNight: boolean };
  currentPosition: { x: number; y: number; landmark: string };
  facingDirection: Direction;
  needs: { energy: number; curiosity: number; comfort: number; sociability: number };
  emotionalState: SimulatedEmotion;
  inventory: Array<{ itemId: string; quantity: number }>;
  visibleLandmarks: Array<{ name: string; x: number; y: number; distance: number }>;
  nearbyCharacters: Array<{ name: string; x: number; y: number; distance: number; activity: string }>;
  nearbyObjects: Array<{ id: string; name: string; x: number; y: number }>;
  recentMemories: string[];
  knownRecipes: string[];
}
