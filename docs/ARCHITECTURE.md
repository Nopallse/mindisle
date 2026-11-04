# EDEN — Technical Architecture

## System Overview

### Browser
- Next.js UI.
- Phaser renderer.
- Game input and camera.
- Receives sanitized world snapshots.
- Receives public events.
- Sends observer controls.

### Server
- World simulation coordinator.
- Per-character agent orchestrator.
- Gemini service.
- Zod validation.
- Memory retrieval.
- Persistence.
- Prisma repositories.

## Core Principle

The simulation is authoritative.

Gemini is a probabilistic decision proposer.

Gemini must never directly mutate authoritative world state.

## Implemented Module Layout (Phase 1 Verified)

src/
  app/
    globals.css             # Tailwind + pixel-art crisp rendering rules
    layout.tsx              # Root HTML wrapper and metadata
    page.tsx                # Observer dashboard entrypoint

  components/
    observer/
      ObserverLayout.tsx    # Responsive grid layout with dynamic SSR-safe Phaser
      TopHUD.tsx            # World clock, day counter, pause, speed & zoom controls
      CharacterSidebar.tsx  # Character list (Naufal, Lauren) & focus controls
      CharacterInspectionPanel.tsx # Selected character coordinates, facing, activity & attributes
      WorldEventLog.tsx     # Live authoritative simulation event stream
      PhaserCanvas.tsx      # StrictMode-safe Phaser canvas mount & teardown

  game/
    config.ts               # Orthogonal resolution, pixelArt nearest-neighbor rendering
    GameBridge.ts           # Typed event & action bridge between UI and Phaser
    assets/
      pixelArtGenerator.ts  # Deterministic procedural 32x32 top-down pixel-art generator
    scenes/
      WorldScene.ts         # Tilemap rendering, character sprites, 4-dir animation, camera pan & zoom

  simulation/
    clock/
      WorldClock.ts         # Authoritative simulation time, speed multipliers, pause
    events/
      EventBus.ts           # Authoritative typed event bus pub/sub
    navigation/
      GridMap.ts            # 30x20 orthogonal tile grid (meadow, paths, pond, bridge, trees, rocks)
      CollisionSystem.ts    # Tile walkability, map boundaries & occupant collision validator
    entities/
      Character.ts          # Deterministic character entity, tile coordinates & interpolation
    world/
      WorldState.ts         # Central singleton simulation state coordinator & snapshot provider

  types/
    character.ts            # Character domain types (Direction, Activity, Snapshot)
    world.ts                # World domain types (Tile, TileType, WorldTime, WorldSnapshot)
    events.ts               # Event types (WorldEvent, WorldEventType)

## Future AI & Persistence Modules (Phases 2-5)

src/
  ai/
    gemini/
    agents/
    prompts/
    schemas/
    orchestration/

  memory/
    retrieval/
    consolidation/
    repositories/

  db/
  lib/

## Decision Cycle

1. Scheduler determines that an agent is eligible to think.
2. Perception service constructs permitted observations.
3. Memory service retrieves relevant memories.
4. Prompt builder creates bounded context.
5. Gemini returns a structured decision.
6. Zod validates the response.
7. Policy validator checks action semantics.
8. Action executor runs the action.
9. Simulation emits events.
10. Memory pipeline stores grounded observations.
11. UI receives sanitized snapshots and public events.

## Async and Concurrency

- Never block Phaser rendering on AI.
- One in-flight decision per character by default.
- Use cooldowns and event triggers.
- Add request IDs and idempotency.
- Ignore stale decisions if the world state changed materially.
- Use timeouts.
- Use bounded retries.
- Use safe fallback behavior.

## Gemini Integration

- Official SDK: @google/genai.
- API key: GEMINI_API_KEY.
- Model: GEMINI_MODEL.
- Never hardcode model IDs in multiple files.
- Use structured output.
- Validate output with Zod.
- Verify current official SDK documentation.
- Do not send full history on every request.
- Track latency and usage metadata when available.

## Persistence

Persist:

- World configuration.
- Latest world state.
- Character profiles.
- Character states.
- Goals.
- Relationships.
- Public conversations.
- World events.
- Character-owned memories.
- Decision and action audit metadata.

Use transactions for state changes that must be atomic.

## Privacy Boundary

A character may receive:

- Its own private profile.
- Its own memories.
- Public world state.
- Permitted local observations.
- Public dialogue it can hear.

A character must not receive:

- Another character's private thoughts.
- Another character's private memories.
- Hidden map information it has not perceived.
- Developer-only diagnostics.

## Failure Handling

### Gemini unavailable

- Keep the game running.
- Do not fabricate successful decisions.
- Use deterministic fallback.
- Record error status.
- Retry under bounded policy.

### Database unavailable

- Show degraded status.
- Do not claim persistence.
- Avoid silent data loss.
- Do not show saved status unless confirmed.

## Observability

Capture:

- Decision request ID.
- Character ID.
- Model identifier.
- Started timestamp.
- Completed timestamp.
- Latency.
- Validation outcome.
- Execution outcome.
- Usage metadata if available.
- Error category.

Never log API keys.

