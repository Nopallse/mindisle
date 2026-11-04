---
name: observer-ui
description: Designs and implements Mindisle's observer-mode interface, responsive HUD, character inspection panels, creation project trackers, event logs, world controls, and game-to-UI bridge.
---

# Mindisle Observer UI

Responsible for the rich observer interface surrounding the living pixel-art world canvas.

The observer watches the world unfold autonomously in real-time, inspects character mental states and inventions, and controls simulation time.

## Key UI Components

1. **Top HUD**:
   - Project brand identity and status.
   - Day counter and world clock (12-hour AM/PM format).
   - Dynamic atmosphere & weather chip (e.g., *🌤️ Golden Sunrise • 20°C*).
   - Quick time-of-day jump presets (Dawn, Noon, Dusk, Night) for lighting inspection.
   - Simulation controls (Play/Pause, 1x, 2x, 5x speed).
   - Camera zoom controls (Zoom In, Zoom Out, Reset).

2. **Left Sidebar — Character & Radar Hub**:
   - Character overview cards (Naufal & Lauren status, current activity, coordinates).
   - **Island Radar (Minimap)**: Scaled 30×20 real-time layout with animated pulsing blips for characters and landmarks.

3. **Right Sidebar — Deep Character & Creation Inspection**:
   - Selected character profile, personality archetype, and behavioral traits.
   - Simulated attributes with animated progress bars (Energy, Curiosity, Sociability).
   - Equipped gear and inventory satchel.
   - Active goals and current causal construction project (materials required vs collected, progress percentage).
   - Location provenance (named landmark based on tile coordinates).

4. **Bottom Bar — World Event Log**:
   - Real-time live feed of authoritative simulation events.
   - Filter pills (`[ALL]`, `[MOVEMENT]`, `[TIME]`, `[SYSTEM]`, `[CREATION]`).
   - Collapsible drawer for maximized canvas visibility.

## Architectural Boundaries

- React UI is strictly an observer and does not own authoritative game state or execute physics.
- The UI receives sanitized state snapshots via `GameBridge` or `EventBus`.
- Avoid full dashboard re-renders at 60 FPS; subscribe only to relevant event deltas.

## Dependencies

- Coordinates with: `eden-game-foundation`, `simulation-systems`, `causality-engine`, `world-provenance`.
