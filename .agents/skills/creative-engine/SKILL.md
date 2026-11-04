---
name: creative-engine
description: Implements the Mindisle Creative Engine, enabling autonomous AI characters to invent, design, specify, and construct novel world objects, furniture, tools, buildings, and decorations without fixed catalog limits.
---

# Mindisle Creative Engine

Responsible for translating open-ended character imagination into executable physical specifications and validated pixel-art assets.

Characters are not limited to a rigid, hardcoded catalog of objects. They can invent new items, subject to physical world rules and validation.

## The 5 Creative Subsystems

```mermaid
flowchart LR
    A[A. Creative Reasoning] --> B[B. Design Specification]
    B --> C[C. Visual Asset Creation]
    C --> D[D. Asset Validation]
    D --> E[E. Asset Persistence]
```

### Subsystem A: Creative Reasoning
Gemini interprets the character's motivation, environment observations, and cultural tendencies to synthesize a novel object idea (e.g., *"A reading bench with a woven reed shade canopy"*).

### Subsystem B: Design Specification
The raw idea is translated into a structured, Zod-validated `ObjectSpecification`:
- `name`: Human-readable identifier.
- `category`: `furniture` | `tool` | `structure` | `decoration` | `machine`.
- `tileDimensions`: `{ width: number, height: number }` (e.g., 2×1 tiles).
- `pixelDimensions`: `{ width: number, height: number }` (e.g., 64×32 px).
- `requiredMaterials`: `Array<{ materialId: string, count: number }>`.
- `requiredTools`: `string[]` (e.g., `["wooden_hammer", "stone_axe"]`).
- `constructionSteps`: Step count, labor energy cost, and difficulty rating.
- `collisionBox`: Local offset and collision bounds.
- `interactionBehavior`: `sit` | `store` | `cook` | `shelter` | `inspect`.
- `palette`: Suggested color scheme matching Mindisle's warm organic palette.

### Subsystem C: Visual Asset Creation
Translates the specification into actual visual data:
- Procedural pixel-matrix synthesis.
- Layered sprite composition (combining base shapes, textures, highlights).
- Dedicated pixel-generation routines or image-generation APIs.

### Subsystem D: Asset Validation
Before any visual asset enters the simulation, it must pass automated checks:
- Strict dimension conformity (multiples of 32px or designated sprite bounds).
- Proper alpha transparency (background is transparent, silhouette is clean).
- Color count and palette harmony (no noisy random gradients).
- Orthogonal top-down perspective adherence.

### Subsystem E: Asset Persistence
- Upload binary PNG/WebP to Firebase Storage.
- Write metadata and compact pixel matrix to Firestore `assetDefinitions`.
- Register the new texture key into Phaser's TextureManager.

## Dependencies

- Coordinates with: `causality-engine`, `pixel-art-generation`, `firebase-asset-persistence`, `phaser-pixel-art`.

