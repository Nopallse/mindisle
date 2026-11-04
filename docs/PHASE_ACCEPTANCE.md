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
- [x] Gemini API client runs strictly server-side via official `@google/genai` SDK.
- [x] Model ID is configurable via `GEMINI_MODEL` environment variable.
- [x] Separate, isolated prompt contexts and system instructions for Naufal and Lauren.
- [x] Decision proposals validate strictly against versioned Zod schemas.
- [x] Invalid actions (e.g. out-of-bounds target, non-walkable tile) are rejected by policy validator.
- [x] One in-flight decision per character; no duplicate simultaneous requests.
- [x] Asynchronous non-blocking loop: Phaser 60 FPS rendering never stutters during API latency.
- [x] Safe fallback triggers upon timeout, rate limit, or network error.
- [x] Request telemetry recorded (latency, token usage, model ID, request UUID).
- [x] Zero client-side leakage of `GEMINI_API_KEY`.
- [x] Automated tests verify Scenario B (no resources), Scenario C (no knowledge), and Scenario H (no magical creation).

---

## Phase 3 — Perception, Dialogue & Social Knowledge Transfer
- [x] Vision perception radius (6 tiles) enforced; unseen objects cannot be targeted.
- [x] Hearing radius (4 tiles) enforced; dialogue cannot be perceived beyond range.
- [x] Spoken dialogue emitted as public event only after action execution.
- [x] Speech bubbles render over characters in Phaser with colored name tags.
- [x] Conversational turn-taking and cooldowns prevent infinite loops.
- [x] Knowledge transfer occurs logically through observation or dialogue (Scenario G).
- [x] Private thoughts are never broadcast or leaked into public conversation history.

---

## Phase 4 — Persistent Memory & Firebase Firestore
- [x] Memory documents persist in character-isolated Firestore subcollections.
- [x] Memory retrieval combines recency decay, importance, and epistemic confidence.
- [x] Consolidation pipeline merges episodic records into reflective summaries.
- [x] Character epistemic graphs distinguish known facts, beliefs, and suspicions.
- [x] Privacy isolation tests pass: Naufal cannot query Lauren's private memories and vice versa.
- [x] Application restart recall tests pass: state and memories restore accurately (Scenario F).

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
