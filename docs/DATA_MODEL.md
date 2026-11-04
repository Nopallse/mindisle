# Mindisle — Firebase Data Model & Schema

## 1. Storage Architecture Overview

Mindisle employs a hybrid persistence model:
- **Google Cloud Firebase Firestore**: Authoritative world state, character mental models, object instances, creation projects, and metadata.
- **Firebase Storage**: Binary PNG/WebP files, animated sprite sheets, and audio assets.

```text
Firestore Root
└── worlds/{worldId}
    ├── metadata (Document)
    ├── state/current (Document)
    ├── characters/{characterId} (Subcollection)
    │   ├── memories/{memoryId} (Subcollection)
    │   ├── knowledge/{knowledgeId} (Subcollection)
    │   └── goals/{goalId} (Subcollection)
    ├── objects/{objectId} (Subcollection)
    ├── assetDefinitions/{assetId} (Subcollection)
    ├── creationProjects/{projectId} (Subcollection)
    ├── resources/{resourceId} (Subcollection)
    ├── provenance/{provenanceId} (Subcollection)
    ├── events/{eventId} (Subcollection)
    └── relationships/{relationId} (Subcollection)

Firebase Storage Root
└── worlds/{worldId}/
    ├── assets/
    │   ├── objects/{assetId}/v{version}.png
    │   └── spritesheets/{assetId}/sheet.png
    └── thumbnails/{assetId}.webp
```

---

## 2. Collection Schemas

### `worlds/{worldId}/state/current`
Authoritative snapshot of simulation progression:
```typescript
interface WorldStateDocument {
  day: number;
  hour: number;
  minute: number;
  isPaused: boolean;
  speedMultiplier: number; // 1, 2, 5
  activeWeather: 'clear' | 'sunrise_mist' | 'golden_sunset' | 'starlit_night';
  temperatureC: number;
  lastTickTimestamp: number; // UTC
}
```

### `worlds/{worldId}/characters/{characterId}`
Stable and mutable character state:
```typescript
interface CharacterDocument {
  id: 'naufal' | 'lauren';
  name: string;
  tileX: number;
  tileY: number;
  direction: 'down' | 'left' | 'right' | 'up';
  activity: 'idle' | 'walking' | 'gathering' | 'constructing' | 'resting';
  
  // Needs (0-100)
  needs: {
    energy: number;
    curiosity: number;
    comfort: number;
    sociability: number;
  };
  
  // Psychological Appraisal
  emotionalState: {
    valence: number; // -1.0 to 1.0
    arousal: number; // 0.0 to 1.0
    dominantLabel: string;
  };
  
  // Inventory
  inventory: Array<{
    itemId: string;
    quantity: number;
  }>;
  
  updatedAt: number;
}
```

### `worlds/{worldId}/characters/{characterId}/memories/{memoryId}`
Character-isolated private episodic and semantic memories:
```typescript
interface MemoryDocument {
  id: string;
  characterId: 'naufal' | 'lauren';
  type: 'episodic' | 'semantic' | 'reflection' | 'creative';
  content: string;
  importance: number; // 1-10
  confidence: number; // 0.0-1.0
  sourceEventId?: string;
  sourceProjectId?: string;
  location?: { x: number; y: number; landmark?: string };
  createdAt: number;
}
```

### `worlds/{worldId}/characters/{characterId}/knowledge/{knowledgeId}`
Private epistemic beliefs and recipes:
```typescript
interface KnowledgeDocument {
  id: string;
  characterId: 'naufal' | 'lauren';
  subject: string; // e.g. "recipe_wooden_bench"
  confidence: number; // >=0.9 Fact, 0.5-0.9 Belief, 0.2-0.5 Suspicion
  acquisitionSource: 'direct_experience' | 'observation' | 'conversation' | 'book';
  sourceCharacterId?: string;
  acquiredAt: number;
}
```

### `worlds/{worldId}/objects/{objectId}`
Physical instances placed on the world map:
```typescript
interface WorldObjectDocument {
  id: string;
  assetDefinitionId: string; // Foreign key to assetDefinitions
  tileX: number;
  tileY: number;
  state: 'intact' | 'damaged' | 'in_use';
  provenanceId: string; // Foreign key to provenance collection
  createdAt: number;
}
```

### `worlds/{worldId}/assetDefinitions/{assetId}`
Visual design and collision blueprint (instantiable multiple times):
```typescript
interface AssetDefinitionDocument {
  id: string;
  name: string;
  category: 'furniture' | 'tool' | 'structure' | 'decoration';
  dimensions: { tileWidth: number; tileHeight: number; pixelWidth: number; pixelHeight: number };
  collisionBox: { offsetX: number; offsetY: number; width: number; height: number };
  layers: Array<{ name: string; zOffset: number; tint?: string }>;
  palette: string[]; // Color hex array
  storageUrl: string; // Firebase Storage download URL
  version: number;
  createdAt: number;
}
```

### `worlds/{worldId}/creationProjects/{projectId}`
Active or completed construction project governed by Causality Engine:
```typescript
interface CreationProjectDocument {
  id: string;
  targetObjectId?: string;
  targetTile: { x: number; y: number };
  proposedBy: 'naufal' | 'lauren';
  collaborators: string[];
  status: 'planning' | 'gathering' | 'in_progress' | 'completed' | 'abandoned';
  
  requiredMaterials: Array<{ materialId: string; required: number; gathered: number }>;
  requiredTools: string[];
  
  totalSteps: number;
  completedSteps: number;
  
  createdAt: number;
  completedAt?: number;
}
```

### `worlds/{worldId}/provenance/{provenanceId}`
Immutable lineage record for created objects:
```typescript
interface ProvenanceDocument {
  id: string;
  objectId: string;
  assetDefinitionId: string;
  creatorId: 'naufal' | 'lauren';
  motivation: string;
  inspirationSource: string;
  materialsUsed: Array<{ materialId: string; quantity: number; sourceLocation: { x: number; y: number } }>;
  toolsUsed: string[];
  laborMinutesTotal: number;
  createdAt: number;
}
```

### `worlds/{worldId}/events/{eventId}`
Authoritative public simulation event stream:
```typescript
interface WorldEventDocument {
  id: string;
  type: 'SYSTEM' | 'MOVEMENT' | 'TIME' | 'SPEAK' | 'CREATION' | 'SOCIAL';
  message: string;
  characterId?: string;
  worldTime: string; // e.g. "Day 1, 08:30"
  createdAt: number;
}
```

---

## 3. Constraints & Optimization Rules

1. **Document Size Constraint**: Maximum 1 MB per document. Never store raw PNG file buffers in Firestore; always stream to Firebase Storage and store the public URL.
2. **Index Optimization**: Composite indexes on `(createdAt DESC)` for event and memory pagination.
3. **Transactions**: Use Firestore transactions (`runTransaction`) for multi-document operations like material consumption and object creation.
