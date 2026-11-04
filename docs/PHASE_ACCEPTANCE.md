# EDEN Phase Acceptance Checklist

## Phase 1 — World Foundation

- [x] App starts locally.
- [x] Phaser mounts exactly once.
- [x] Phaser cleans up correctly.
- [x] Camera is true top-down orthogonal.
- [x] Tilemap includes walkable and blocked tiles.
- [x] Naufal and Lauren render as distinct sprites.
- [x] Four-direction movement works.
- [x] Animations work.
- [x] Collision prevents crossing blocked tiles.
- [x] Camera pan and zoom work.
- [x] Observer UI displays world time.
- [x] Character selection works.
- [x] No fake AI is presented as real functionality.

## Phase 2 — Gemini Brain

- [ ] Gemini SDK is server-side only.
- [ ] Model is configurable.
- [ ] Separate prompts for Naufal and Lauren.
- [ ] Structured output validated with Zod.
- [ ] Invalid actions are rejected.
- [ ] One in-flight decision per character.
- [ ] Gemini latency does not block rendering.
- [ ] Timeout fallback works.
- [ ] Usage telemetry available.
- [ ] API key is not exposed.

## Phase 3 — Social Interaction

- [ ] Perception range is enforced.
- [ ] Hearing range is enforced.
- [ ] Dialogue comes from accepted actions.
- [ ] Conversation history is persisted.
- [ ] Characters can initiate conversations.
- [ ] Characters can respond.
- [ ] Cooldowns prevent infinite loops.
- [ ] Private thoughts are not public dialogue.

## Phase 4 — Memory

- [ ] Memories originate from actual events.
- [ ] Memory ownership is enforced.
- [ ] Retrieval is character-specific.
- [ ] Restart restores memories.
- [ ] Consolidation preserves provenance.
- [ ] Private memory isolation is tested.

## Phase 5 — Living World

- [ ] Needs evolve with time.
- [ ] Goals can be created and completed.
- [ ] Emotion state follows explicit rules.
- [ ] Relationship changes follow actual interactions.
- [ ] Characters explore.
- [ ] Characters interact with objects.
- [ ] Simulation speed controls work.
