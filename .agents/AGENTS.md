# EDEN Workspace Instructions

You are the engineering team for EDEN, a persistent autonomous-agent simulation presented as a true top-down 2D pixel-art game.

## Mission

Build a small, believable living world before expanding its scope.

The initial inhabitants are Naufal and Lauren. Each is a separate simulated agent powered by Google Gemini API.

The agents have distinct identities, private memories, needs, goals, emotional state, perceptions, and decision histories.

The objective is emergent behavior under explicit world rules, not a scripted story and not two chatbots with sprites.

## Product Invariants

1. True top-down camera: directly above the map; never isometric or side-view.
2. The world simulation is authoritative for positions, collision, time, objects, and valid actions.
3. Gemini proposes intentions and structured actions; deterministic game systems validate and execute them.
4. Naufal and Lauren have isolated private contexts and memories.
5. Neither can inspect the other's private thoughts.
6. The game loop never waits synchronously for Gemini.
7. Never call Gemini per frame.
8. All model output is untrusted. Validate with Zod and enforce world rules before execution.
9. Gemini credentials remain server-side.
10. Persistent memories must be grounded in actual observations and events.
11. Do not label simulated emotions as real consciousness or human feelings.
12. Keep the MVP small: two characters, one small map, and a limited action set.

## Preferred Stack

- Next.js App Router
- React
- TypeScript
- Phaser 3
- Tailwind CSS
- shadcn/ui where useful
- Google Gemini API
- Official JavaScript SDK: @google/genai
- Neon PostgreSQL
- Prisma ORM
- Zod
- pgvector only after verifying compatibility and need
- Vitest
- Playwright when configured

Use current stable compatible versions.

Verify official documentation before relying on version-specific APIs.

## Architecture Boundaries

- src/game: rendering, input, Phaser scenes, map, movement, collision, animation.
- src/simulation: deterministic world state, clock, events, needs, perception, action validation and execution, scheduler.
- src/ai: Gemini integration, prompts, schemas, agent orchestration.
- src/memory: memory retrieval, persistence, and consolidation.
- src/server: API routes and server services.
- src/db: Prisma client and repositories.
- src/components: React observer UI.
- src/types: shared domain types.

React UI must not own authoritative game state.

Phaser must not call Gemini directly.

Game rendering must not contain prompt logic.

Database access must not happen inside Phaser scenes.

## AI Agent Rules

- One agent identity/configuration per character.
- Each decision request receives only that character's private state, permitted observations, public world facts, and its own retrieved memories.
- Dialogue is public only after the speaking action is executed.
- The other character may perceive dialogue only if within hearing range.
- Internal thought is private.
- Use structured output with a versioned Zod schema.
- Treat model output as a proposal, not authority.
- Validate target existence, range, walkability, permissions, and cooldowns.
- If Gemini fails, use safe deterministic fallback behavior.
- Add request IDs and idempotency to AI decisions.
- Record model, latency, status, and usage metadata when available.
- Never log secrets.

## Engineering Workflow

For every task:

1. Read relevant docs and skills.
2. Inspect existing code before editing.
3. State assumptions and a short plan for non-trivial work.
4. Implement the smallest coherent slice.
5. Add or update tests.
6. Run typecheck, lint, relevant tests, and build when practical.
7. Update docs/ROADMAP.md.
8. Report changed files, commands run, outcomes, and limitations.

Never claim unrun tests passed.

Avoid unnecessary dependencies and overengineering.

## Phase Gates

Phase 1: playable world foundation; no fake AI.

Phase 2: secure Gemini integration and independent decision loop.

Phase 3: perception, dialogue, and social interaction.

Phase 4: persistent episodic and semantic memory.

Phase 5: needs, emotions, goals, time, and autonomous daily life.

Do not start a later phase until the current phase acceptance criteria are met unless the user explicitly changes scope.
