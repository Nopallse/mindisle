---
name: simulation-systems
description: Implements Mindisle's authoritative deterministic simulation engine, world clock, event bus, perception boundaries, navigation grid, collision detection, action execution, and deterministic offline progression.
---

# Mindisle Simulation Systems

Responsible for the authoritative, deterministic simulation that governs time, space, physical boundaries, and action validity in Mindisle.

## Core Responsibilities

- **World Clock (`WorldClock`)**: Manages continuous simulation time (Day, Hour, Minute), speed scaling (1x, 2x, 5x), and pause states.
- **Event Bus (`EventBus`)**: Typed pub/sub bus for world ticks, movement events, speaks, crafts, and system notifications.
- **Authoritative Grid & Collision (`GridMap`, `CollisionSystem`)**:
  - Enforces walkable vs blocked tiles (water, dense trees, boulders, walls).
  - Occupant collision: prevents characters from stepping into tiles occupied by others.
- **Perception System**: Calculates line-of-sight, visibility radius (e.g., 6 tiles), and hearing range (e.g., 4 tiles). Rejects omniscient information leakage.
- **Action Execution & Policy Enforcement**:
  - Validates proposed actions: `MOVE`, `WAIT`, `GATHER`, `CRAFT_STEP`, `INSPECT`, `SPEAK`.
  - Enforces ranges, cooldowns, and tool prerequisites.
- **Deterministic Offline Progression**:
  - When the user closes the browser or the server resumes, world time catches up using deterministic calculations without hallucinating unsimulated events or draining Gemini tokens.

## Architectural Invariants

1. **Simulation is Authoritative**: Phaser and Gemini are clients to the simulation engine. The simulation decides if a move or craft succeeds or fails.
2. **Safe Fallbacks on AI Latency**: The simulation tick never blocks waiting for an LLM response. Characters maintain their current activity or switch to idle if Gemini times out.

## Dependencies

- Coordinates with: `causality-engine`, `eden-game-foundation`, `autonomous-agent-behavior`, `observer-ui`.
