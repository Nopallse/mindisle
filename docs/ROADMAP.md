# Mindisle — Implementation Roadmap

Status Legend:
- `not-started`
- `in-progress`
- `blocked`
- `verified`

---

## Phase 0 — Project Setup
- [x] Inspect environment & Node LTS compatibility.
- [x] Initialize Next.js App Router project with TypeScript.
- [x] Configure ESLint and Prettier standards.
- [x] Configure Vitest test harness.
- [x] Establish `.agents/` instructions, skills, and workflows.

**Status**: `verified`

---

## Phase 1 — World Foundation
- [x] Phaser 3 integration with Next.js App Router (StrictMode-safe lifecycle).
- [x] True top-down orthogonal pixel-art map (30×20 tiles, 960×640 px).
- [x] Environmental scenery: Cobblestone paths, stone well, campfire, vegetable garden, pond with lilies, wooden fences, lanterns.
- [x] Independent Naufal and Lauren placeholder sprites with 4-direction animations and breathing bob.
- [x] Authoritative grid collision system preventing blocked-tile crossing.
- [x] Camera controls: Drag-to-pan, mouse-wheel zoom, and character focus.
- [x] Observer Dashboard: Top HUD, dynamic weather chip, real-time 30×20 radar minimap, filtered World Event Log, and Character Inspection panel.
- [x] 14/14 Vitest unit tests passing, zero TypeScript errors, clean production build.

**Status**: `verified`  
**Acceptance**: Local playable world with two autonomous entities, orthogonal grid, verified collision, and zero fake AI.

---

## Phase 2 — Gemini Brain & Causality Gateway
- [x] Server-side Gemini client integration via official `@google/genai` SDK.
- [x] Isolated prompt contexts and system instructions for Naufal and Lauren.
- [x] Structured decision proposal schema enforced via Zod.
- [x] Causality Gateway: Rejection of magical creation claims without causal history.
- [x] Asynchronous non-blocking scheduler: Phaser rendering loop never blocks on AI latency.
- [x] Deterministic safe fallback for timeouts, rate limits, and network errors.
- [x] Telemetry logging: Request ID, latency, model ID, and token usage metadata.
- [x] Mocked Gemini test fixtures verifying Scenarios B, C, D, and H.

**Status**: `completed`  
**Acceptance**: Both characters independently receive structured AI decisions and execute valid actions in the simulation without blocking the rendering loop.

---

## Phase 3 — Perception, Dialogue & Social Knowledge Transfer
- [x] Perception pipeline: Bounded line-of-sight and vision radius (6 tiles).
- [x] Hearing pipeline: Bounded dialogue audibility radius (4 tiles).
- [x] Execution-gated speech: Dialogue becomes public only after validated `SPEAK` action execution.
- [x] Visual speech bubbles: Overhead dialogue balloons with colored character name tags (Adam/Naufal blue, Eve/Lauren pink).
- [x] Social turn-taking and conversational cooldowns.
- [x] In-world knowledge transfer via observation and dialogue (Scenario G).

**Status**: `completed`  
**Acceptance**: Characters initiate contextual conversations within hearing distance and acquire shared knowledge without telepathic memory leaks.

---

## Phase 4 — Persistent Memory & Firebase Firestore
- [x] Firebase Firestore integration using server-side Firebase Admin SDK.
- [x] Character-isolated subcollections: `worlds/{worldId}/characters/{characterId}/memories`.
- [x] Contextual memory retrieval combining recency decay, importance weighting, and keyword match.
- [x] Periodic memory consolidation and reflective summarization.
- [x] Epistemic knowledge graph distinguishing facts ($\ge 0.9$), beliefs ($0.5-0.9$), and suspicions ($<0.5$).
- [x] Automated memory privacy isolation tests.
- [x] Application restart recall tests (Scenario F).

**Status**: `completed`  
**Acceptance**: Characters recall past experiences and knowledge after server restart, with strict zero-leakage privacy.

---

## Phase 5 — Autonomous Living World & Offline Progression
- [x] Dynamic physiological needs: Energy, curiosity, comfort, and sociability decay.
- [x] Motivation appraisal: Needs trigger active desires and intentions.
- [x] Emotional appraisal state (valence, arousal, dominance).
- [x] Day/night cycle with dynamic ambient lighting tinting.
- [x] Dynamic weather conditions affecting behavior (rain, clear sun, dusk mist).
- [x] Deterministic offline progression: World time advances mathematically without hallucinated events.

**Status**: `completed`  
**Acceptance**: Characters independently live daily routines, rest near campfires, explore the island, and manage needs without player intervention.

---

## Phase 6 — Mindisle Creative Engine, Asset Pipeline & World Provenance
- [ ] Creative Engine reasoning: Characters synthesize open-ended inventions without fixed catalogs (Scenario E).
- [ ] Zod ObjectSpecification parser (dimensions, materials, collision, interaction).
- [ ] Programmatic pixel-art generation: Procedural pixel matrices, palette mapping, and layer composition.
- [ ] Automated visual asset validation: Strict dimensions, transparency mask, and palette harmony.
- [ ] Firebase Storage persistence: Automated PNG upload and Firestore `assetDefinitions` linking.
- [ ] Multi-step construction project execution over simulation time.
- [ ] Immutable `ObjectProvenance` record generation linking creator, materials, and inspiration.
- [ ] Dynamic in-game sprite injection into Phaser TextureManager without page reloads.

**Status**: `not-started`  
**Acceptance**: Characters can imagine, specify, gather materials for, and construct novel physical objects that become permanent, interactive, visually unique fixtures in the shared world.
