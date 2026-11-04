---
name: world-provenance
description: Records, maintains, and audits the historical lineage and creation provenance of every physical object, building, tool, and modification in the Mindisle living world.
---

# Mindisle World Provenance

Responsible for ensuring every permanent object and structure in Mindisle carries an immutable, queryable pedigree of its origin.

## Provenance Schema

Each physical object instantiated in `worlds/{worldId}/objects/{objectId}` links to a dedicated `ProvenanceRecord`:

```typescript
interface ObjectProvenance {
  id: string; // Provenance record ID
  objectId: string; // Target world object ID
  assetDefinitionId: string;
  assetVersion: number;
  
  // Creators & Inspiration
  primaryCreatorId: 'naufal' | 'lauren';
  collaboratorIds: string[];
  motivation: string; // e.g. "Fatigue after exploration created a desire to rest comfortably"
  inspirationSource: string; // e.g. "Observed the fallen oak tree and stone campfire"
  
  // Material & Tool Provenance
  materialsUsed: Array<{
    materialId: string; // e.g. "oak_wood"
    quantity: number;
    sourceLocation: { x: number; y: number }; // Coordinates where wood was felled
  }>;
  toolsUsed: string[]; // e.g. ["copper_adze", "stone_mallet"]
  
  // Execution Metrics
  constructionStartedAt: number; // UTC timestamp
  constructionCompletedAt: number;
  totalLaborMinutes: number;
  recordedFailureAttempts: number;
  
  // Historical Significance
  historicalNotes: string[];
}
```

## Architectural Rules

1. **Immutability**: Once an object is constructed, its origin provenance cannot be modified, only appended with modification or repair events.
2. **Observer Inspection**: The Observer UI can display this full provenance tree when an observer clicks on an object in the world.
3. **Epistemic Grounding**: When another character (e.g., Lauren) inspects an object built by Naufal, she learns its creator, materials, and purpose through grounded observation.

## Dependencies

- Coordinates with: `causality-engine`, `creative-engine`, `firebase-world-database`, `observer-ui`.

