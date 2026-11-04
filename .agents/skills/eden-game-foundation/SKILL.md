---
name: eden-game-foundation
description: Builds and maintains Mindisle's Phaser 3 game foundation, true top-down tilemap, movement, collision, camera, scenes, dynamic object rendering, and Next.js integration.
---

# Mindisle Game Foundation

Responsible for the client-side game presentation, rendering, scene lifecycles, and visual interactions.

## Responsibilities

- Phaser 3 game configuration and Next.js SSR-safe lifecycle management.
- True top-down orthogonal map rendering (never isometric or side-view).
- Character entity visualization (4-direction spritesheets, animations, idle breathing, footstep particles).
- Dynamic rendering of constructed objects and player-created pixel-art assets.
- Camera controls (drag to pan, mouse-wheel zoom, character focus/follow).
- Decoupled unidirectional bridge (`GameBridge`) between React UI and Phaser.

## Architectural Rules

1. **Rendering is Subordinate to Simulation**: Phaser never decides character positions, valid actions, or creation outcomes; it renders authoritative state snapshots provided by `WorldState`.
2. **Never Call Gemini Inside Phaser**: AI decision calls and server persistence must never exist inside Phaser scene loops.
3. **True Top-Down Orthogonal View**: Camera is orthogonal directly overhead. No 3D tilt, no isometric skew, no side-view platforms.
4. **Nearest-Neighbor Crisp Pixel Art**: `antialias: false`, `pixelArt: true`, `roundPixels: true`.
5. **Clean Canvas Teardown**: In React 18/19 StrictMode, ensure `game.destroy(true)` cleans up DOM canvas and textures without memory leaks.
6. **Dynamic Asset Injection**: Newly constructed objects must be dynamically loaded or drawn to Phaser's TextureManager from validated pixel matrices or URLs without requiring a page reload.

## Dependencies

- Coordinates with: `simulation-systems`, `phaser-pixel-art`, `creative-engine`, `observer-ui`.
