---
name: phaser-pixel-art
description: Creates, integrates, and enforces cohesive top-down pixel-art assets, spritesheets, tilemaps, animations, dynamic textures, and visual effects for Mindisle using Phaser conventions.
---

# Phaser Pixel Art Pipeline

Responsible for the aesthetic visual integrity, sprite formatting, tilemaps, animation sets, and dynamic texture registration in Phaser.

## Art Direction Guidelines

- **True Top-Down Orthogonal Perspective**: Directly overhead camera angle (never isometric, never 2D side-scrolling platformer, never 3D tilt).
- **Consistent Grid Scale**: 32×32 pixel tiles as the standard unit (supports 16×16, 32×32, 64×64 structured multi-tile objects).
- **Nearest-Neighbor Rendering**: Strict crisp pixel edges; no anti-aliased blur or bilinear texture filtering.
- **Harmonious Palette & Hue Shifting**: Highlights shift toward warm golden yellow/light green; shadows shift toward cool deep teal/navy. Avoid raw black shadows.
- **Volume & Clustering**: Foliage and round objects use clustered volume shading rather than individual noise pixels.
- **Dynamic Textures in WebGL**: Any canvas-generated texture must call `texture.refresh()` to upload pixel buffers into WebGL GPU VRAM.

## Dynamic In-Game Asset Integration

When the Creative Engine produces a new object or variation:
1. Validate PNG/WebP dimensions and transparency.
2. Load via `scene.load.image` or register directly into `scene.textures.addCanvas` / `scene.textures.addImage`.
3. Slice animation frames or multi-tile layers using `texture.add(frameKey, ...)`.
4. Render as a depth-sorted `Phaser.GameObjects.Sprite` with `setDepth(worldY)`.

## Dependencies

- Coordinates with: `eden-game-foundation`, `pixel-art-generation`, `creative-engine`, `firebase-asset-persistence`.
