# Mindisle — Phase Acceptance Checklist

## Phase 1 — World Foundation
- [x] Next.js App Router starts locally with zero hydration or chunk loading errors.
- [x] Phaser mounts cleanly inside `PhaserCanvas` and cleans up on unmount.
- [x] Camera perspective is strictly true top-down orthogonal (no isometric or 3D angles).
- [x] Tilemap renders 30×20 orthogonal grid with explicit walkable and non-walkable tiles.
- [x] Naufal and Lauren render as distinct pixel-art sprites with 4-direction animations.
- [x] Collision prevents characters from crossing blocked tiles or entering occupied tiles.
- [x] Camera pan (drag) and zoom (scroll wheel) function smoothly within bounds.
- [x] Observer UI displays world time, weather, island radar minimap, and event feed.
- [x] Zero fake or scripted AI behavior presented as real functionality.
- [x] 14/14 automated Vitest tests pass.

---

## Phase 2 — Gemini Brain & Causality Gateway
- [ ] Gemini API client runs strictly server-side via official `@google/genai` SDK.
- [ ] Model ID is configurable via `GEMINI_MODEL` environment variable.
- [ ] Separate, isolated prompt contexts and system instructions for Naufal and Lauren.
- [ ] Decision proposals validate strictly against versioned Zod schemas.
- [ ] Invalid actions (e.g. out-of-bounds target, non-walkable tile) are rejected by policy validator.
- [ ] One in-flight decision per character; no duplicate simultaneous requests.
- [ ] Asynchronous non-blocking loop: Phaser 60 FPS rendering never stutters during API latency.
- [ ] Safe fallback triggers upon timeout, rate limit, or network error.
- [ ] Request telemetry recorded (latency, token usage, model ID, request UUID).
- [ ] Zero client-side leakage of `GEMINI_API_KEY`.
- [ ] Automated tests verify Scenario B (no resources), Scenario C (no knowledge), and Scenario H (no magical creation).

---

## Phase 3 — Perception, Dialogue & Social Knowledge Transfer
- [ ] Vision perception radius (6 tiles) enforced; unseen objects cannot be targeted.
- [ ] Hearing radius (4 tiles) enforced; dialogue cannot be perceived beyond range.
- [ ] Spoken dialogue emitted as public event only after action execution.
- [ ] Speech bubbles render over characters in Phaser with colored name tags.
- [ ] Conversational turn-taking and cooldowns prevent infinite loops.
- [ ] Knowledge transfer occurs logically through observation or dialogue (Scenario G).
- [ ] Private thoughts are never broadcast or leaked into public conversation history.

---

## Phase 4 — Persistent Memory & Firebase Firestore
- [ ] Memory documents persist in character-isolated Firestore subcollections.
- [ ] Memory retrieval combines recency decay, importance, and epistemic confidence.
- [ ] Consolidation pipeline merges episodic records into reflective summaries.
- [ ] Character epistemic graphs distinguish known facts, beliefs, and suspicions.
- [ ] Privacy isolation tests pass: Naufal cannot query Lauren's private memories and vice versa.
- [ ] Application restart recall tests pass: state and memories restore accurately (Scenario F).

---

## Phase 5 — Autonomous Living World & Offline Progression
- [ ] Physiological needs (energy, curiosity, comfort, sociability) decay deterministically.
- [ ] Needs trigger active motivations and goal generation.
- [ ] Simulated emotional appraisal updates based on outcomes.
- [ ] Day/night cycle transitions with dynamic ambient lighting tinting.
- [ ] Deterministic offline progression advances world state without hallucinated events.

---

## Phase 6 — Mindisle Creative Engine, Asset Pipeline & World Provenance
- [ ] Creative Engine reasoning proposes novel objects without fixed catalog restrictions (Scenario E).
- [ ] Zod `ObjectSpecification` validates dimensions, materials, tools, and collision boxes.
- [ ] Procedural pixel-art generator produces valid pixel matrices and RGBA buffers.
- [ ] Asset validator enforces dimensions, transparency masks, and palette harmony.
- [ ] Generated assets upload to Firebase Storage, with metadata stored in Firestore.
- [ ] Multi-step construction projects execute over simulation time.
- [ ] Complete 14-step causal chain verified (Scenario A).
- [ ] Dynamic in-game sprite injection into Phaser TextureManager works without page reload.
- [ ] Immutable `ObjectProvenance` log records creator, materials, tools, and inspiration.
