---
name: eden-game-foundation
description: Builds and maintains EDEN's Phaser 3 game foundation, true top-down tilemap, movement, collision, camera, scenes, and Next.js integration.
---

# EDEN Game Foundation

## Responsibilities

Build the actual playable game.

Use when implementing:
- Phaser integration.
- Game scenes.
- Maps.
- Character movement.
- Camera.
- Collision.
- Animation.
- World rendering.

## Rules

- Use true top-down orthogonal coordinates.
- Never use isometric projection.
- Keep Phaser separate from React components.
- Keep Gemini services outside Phaser.
- Use nearest-neighbor rendering.
- Use tile coordinates for navigation.
- Use world coordinates for rendering.
- Keep map dimensions configurable.
- Prevent duplicate Phaser instances.
- Clean up listeners and timers on unmount.
- Respect collision and walkability.

## Implementation Checklist

1. Verify Phaser version and API.
2. Build minimal scene.
3. Create canvas lifecycle.
4. Load placeholder assets.
5. Create map layers.
6. Create collision layer.
7. Implement four-direction movement.
8. Implement animation states.
9. Implement camera controls.
10. Connect observer UI.
11. Add navigation tests.

## Acceptance Criteria

- Game mounts exactly once.
- Top-down map renders correctly.
- Characters move in four directions.
- Blocked tiles cannot be crossed.
- Camera controls work.
- Unmount cleans all resources.

