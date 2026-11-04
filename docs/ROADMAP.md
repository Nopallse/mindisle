# EDEN Roadmap

Status:

- not-started
- in-progress
- blocked
- verified

## Phase 0 — Project Setup

- [x] Inspect environment.
- [x] Initialize application.
- [x] Configure lint.
- [x] Configure TypeScript.
- [x] Configure tests.
- [x] Install compatible dependencies.
- [x] Document commands.

Status: verified

## Phase 1 — World Foundation

- [x] Phaser integrated with Next.js.
- [x] True top-down grass tilemap.
- [x] Naufal and Lauren placeholder sprites.
- [x] Four-direction movement.
- [x] Collision and navigation grid.
- [x] Camera pan and zoom.
- [x] Observer dashboard.
- [x] World clock.
- [x] Pause and speed controls.
- [x] Browser verification.

Status: verified
Acceptance:
Playable local world with two movable characters (Naufal & Lauren).
Orthogonal top-down tilemap with rich environmental props (campsite with campfire, canvas tent, stone well, timber bridge, pond with water lilies, sandy shoreline, vegetable garden, wooden fences, benches, fishing pier, ancient sun shrine, glowing lanterns).
Natural character animations (breathing bob, footstep dust, arm/stride walking cycles, selection ring, joy emotes).
Observer dashboard with dynamic weather/atmosphere, quick time presets, real-time 30x20 island radar, event log filters, and character inspection.
Deterministic simulation and zero fake AI. Ready for Phase 2.

## Phase 2 — Gemini Brain

- [ ] Server-only Gemini integration.
- [ ] Configurable model.
- [ ] Independent Naufal and Lauren profiles.
- [ ] Structured decision schema.
- [ ] Zod validation.
- [ ] Action policy.
- [ ] Async scheduler.
- [ ] Concurrency locks.
- [ ] Safe fallback.
- [ ] Usage telemetry.
- [ ] Mocked AI tests.

Acceptance:
Both characters independently receive AI decisions and execute valid actions.

## Phase 3 — Social Interaction

- [ ] Character perception.
- [ ] Hearing range.
- [ ] Conversation initiation.
- [ ] Conversation responses.
- [ ] Dialogue bubbles.
- [ ] Conversation history.
- [ ] Turn-taking.
- [ ] Cooldowns.

Acceptance:
Characters can initiate and sustain meaningful conversations.

## Phase 4 — Memory

- [ ] Short-term memory.
- [ ] Episodic memory.
- [ ] Relevant memory retrieval.
- [ ] Memory consolidation.
- [ ] Persistent storage.
- [ ] Privacy isolation tests.
- [ ] Restart recall tests.

Acceptance:
Characters recall relevant past experiences after restarting the game.

## Phase 5 — Living World

- [ ] Needs.
- [ ] Goals.
- [ ] Emotion appraisal.
- [ ] Relationship evolution.
- [ ] Day and night.
- [ ] Weather.
- [ ] Object interactions.
- [ ] Autonomous exploration.

Acceptance:
Characters exhibit ongoing behavior without direct player commands.

## Phase 6 — Expansion

- [ ] Additional characters.
- [ ] More objects.
- [ ] More locations.
- [ ] World-building mechanics.
- [ ] Save slots.
- [ ] World history.
