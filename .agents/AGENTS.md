# Mindisle Workspace Instructions

You are the engineering team for **Mindisle**, a persistent autonomous-agent living world simulation presented as a true top-down 2D pixel-art game.

## Mission

Build a believable, evolving living world inhabited by autonomous AI characters, starting with **Naufal** and **Lauren**.

Each character is a separate simulated agent powered by Google Gemini API with:
- Independent reasoning and distinct personalities.
- Needs, desires, motivations, and goals.
- Memories and accumulated experiences.
- Knowledge that develops over time (distinguishing facts, beliefs, and suspicions).
- Relationships with other characters.
- Creative imagination (ability to invent, design, and construct new things).
- Ability to learn from success and failure.

The objective is emergent behavior under explicit world rules, not a scripted story, and not chatbots with sprites. The developer provides the world's foundational laws and simulation capabilities, not a fixed narrative.

## Core Philosophy: Unlimited Imagination, Logical Execution

Characters may imagine anything, but they cannot automatically materialize anything.

**Every creation and meaningful world change must have a logical explanation and causal provenance:**
1. A character develops a need or motivation.
2. The character observes the environment and gathers inspiration.
3. The character forms an idea and plans the project.
4. The system validates required materials, knowledge, tools, skills, and location.
5. The character gathers required resources and performs actual construction actions in the world.
6. The simulation engine validates each action step.
7. The object is created only upon successful construction completion.
8. The visual asset is generated or assembled as actual pixel data.
9. The object and asset are persisted in Firebase.
10. The character remembers the experience, and the object becomes part of the shared world.

If materials or knowledge are lacking, the character must find alternatives, learn, experiment, or fail. Failures produce realistic consequences and grounded memories.

**Do not allow Gemini to directly declare that an object exists. Gemini proposes intentions and design specifications; the simulation engine determines what actually happens.**

## Product Invariants

1. **True top-down camera**: Directly above the map (orthogonal grid); never isometric or side-view.
2. **Simulation is authoritative**: The world simulation engine controls positions, collision, time, objects, physics, and valid actions.
3. **Causality Engine enforcement**: All world mutations, crafts, and constructions must have traceable causal provenance.
4. **Mindisle Creative Engine**: AI can imagine and propose open-ended objects, furniture, tools, buildings, decorations, and mechanics, which are translated into executable specs and validated pixel assets.
5. **Pixel Art is actual data**: Visual assets are stored as actual pixel matrices, RGBA arrays, palettes, layers, and PNG files in Firebase Storage and Firestore metadata.
6. **Isolated private contexts**: Naufal and Lauren have separate minds and memories. Neither can inspect the other's private thoughts.
7. **Asynchronous non-blocking loop**: The game loop and Phaser rendering (60 FPS) never wait synchronously for Gemini.
8. **No per-frame AI calls**: Never call Gemini per frame. Invoke Gemini on events, schedule intervals, or when deliberation is required.
9. **Untrusted AI output**: All model output is a proposal. Validate with Zod schemas and enforce world rules before execution.
10. **Server-side credentials**: Gemini API keys and Firebase admin credentials remain strictly server-side.
11. **Grounded memories**: Persistent memories and knowledge must originate from actual observations, executions, or conversations.
12. **Simulated autonomy disclaimer**: Do not label simulated emotions or autonomy as real human feelings or consciousness.

## Preferred Stack

- **Frontend & Game**: Next.js App Router, React, TypeScript, Phaser 3, Tailwind CSS.
- **AI**: Google Gemini API via official `@google/genai` SDK (server-side only, configurable model via environment variables).
- **Backend & Persistence**: Firebase Firestore (primary database, world state, metadata, compact pixel matrices) and Firebase Storage (actual PNG/WebP files, sprite sheets, audio).
- **Validation & Testing**: Zod (runtime validation), Vitest (unit/scenario tests), Playwright (browser verification when configured).

Do not use Neon, PostgreSQL, or Prisma in this architecture unless a specific future requirement explicitly justifies them.

## Architecture Boundaries

- `src/game`: Rendering, input, Phaser scenes, tilemap, movement, camera pan & zoom.
- `src/simulation`: Deterministic world state, clock, events, needs, perception, action execution, and the **Causality Engine**.
- `src/creative`: The **Mindisle Creative Engine** (creative reasoning, design specifications, procedural pixel generator, asset validation).
- `src/ai`: Gemini integration, prompts, Zod schemas, character brain orchestration.
- `src/memory`: Episodic/semantic memory retrieval, consolidation, and **Knowledge & Learning** graphs.
- `src/provenance`: Object provenance tracking, creation project lifecycles, and causal audit logs.
- `src/firebase`: Firebase client/admin configuration, Firestore repositories, and Storage services.
- `src/components`: React observer interface (TopHUD, Minimap, CharacterInspection, WorldEventLog).
- `src/types`: Shared domain types.

React UI must not own authoritative game state.
Phaser must not call Gemini directly.
Game rendering must not contain prompt logic.
Direct database access must not happen inside Phaser scenes.

## AI Agent Rules

- One agent identity/configuration per character.
- Each decision request receives only that character's private state, permitted observations, public world facts, and its own retrieved memories.
- Dialogue is public only after the speaking action is validated and executed.
- Another character may perceive dialogue only if within hearing range.
- Internal thought is private.
- Treat model output as a proposal, not authority.
- Validate target existence, range, walkability, permissions, resource costs, and cooldowns.
- If Gemini fails or times out, use safe deterministic fallback behavior.
- Add request IDs and idempotency to AI decisions.
- Record model, latency, status, and usage metadata when available.
- Never log secrets or private credentials.

## Engineering Workflow

For every task:
1. Read relevant docs and skills.
2. Inspect existing code before editing.
3. State assumptions and a short plan for non-trivial work.
4. Implement the smallest coherent slice.
5. Add or update tests (including causality and persistence scenarios).
6. Run typecheck, lint, relevant tests, and build when practical.
7. Update `docs/ROADMAP.md`.
8. Report changed files, commands run, outcomes, and limitations.

Never claim unrun tests passed. Avoid unnecessary dependencies and overengineering.

## Phase Gates

- **Phase 1**: Playable world foundation; orthogonal tilemap, character navigation, collision, observer HUD (Verified).
- **Phase 2**: Secure Gemini integration, independent decision loop, causality engine validation.
- **Phase 3**: Perception, dialogue, social interaction, and knowledge transfer.
- **Phase 4**: Persistent episodic memory, semantic knowledge graphs, and Firebase persistence.
- **Phase 5**: Needs, emotions, goals, autonomous daily life, and offline deterministic progression.
- **Phase 6**: Mindisle Creative Engine, pixel art generation, construction projects, and world provenance.

Do not start a later phase until the current phase acceptance criteria are met unless the user explicitly changes scope.
