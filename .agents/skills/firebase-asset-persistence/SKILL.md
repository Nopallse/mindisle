---
name: firebase-asset-persistence
description: Manages actual visual pixel-art persistence across Firebase Storage (binary PNG/WebP files, sprite sheets) and Firestore (compact pixel matrices, palette tables, and asset metadata).
---

# Firebase Asset Persistence

Responsible for persisting, versioning, and serving actual pixel-art assets created by the Mindisle Creative Engine.

## Storage Hierarchy

Visual assets follow a two-tier storage architecture:

### 1. Firebase Storage (Binary Asset Store)
Stores high-resolution binary graphics, compressed PNGs, animated sprite sheets, and audio files.
- Paths:
  - `worlds/{worldId}/assets/objects/{assetId}/v{version}.png`
  - `worlds/{worldId}/assets/spritesheets/{assetId}/sheet.png`
  - `worlds/{worldId}/assets/thumbnails/{assetId}.webp`

### 2. Firestore `assetDefinitions` (Metadata & Compact Data Store)
Stores structural specifications, layer definitions, collision geometry, color palettes, and optional compact RLE (Run-Length Encoded) pixel matrices for fast server-side validation.
```typescript
interface AssetDefinition {
  id: string; // Unique asset definition hash or ID
  name: string; // e.g., "Carved Oak Armchair"
  category: 'furniture' | 'tool' | 'building' | 'decoration' | 'structure';
  dimensions: { tileWidth: number; tileHeight: number; pixelWidth: number; pixelHeight: number };
  collisionBox: { offsetX: number; offsetY: number; width: number; height: number };
  layers: Array<{ name: string; zOffset: number; tint?: string }>;
  palette: string[]; // Hex color codes used
  compactMatrix?: string; // Optional compact RLE string for fast indexing
  storageUrl: string; // Firebase Storage download URL
  version: number;
  createdAt: number;
}
```

## Architectural Separation

- **Asset Definition**: The blueprint and visual file (e.g., "Carved Oak Chair Asset").
- **World Object Instance**: The physical entity located at tile `(x, y)` in `worlds/{worldId}/objects/{objectId}` referencing `assetDefinitionId`.
- **Multiple Instances**: A single asset definition can be instantiated dozens of times across the map without re-uploading duplicate image binaries.

## Dependencies

- Coordinates with: `creative-engine`, `pixel-art-generation`, `firebase-world-database`, `phaser-pixel-art`.

