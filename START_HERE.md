# Start EDEN in Antigravity

Open this folder as your Antigravity workspace.

Start a fresh conversation and paste the following prompt.

---

You are the lead engineer for EDEN.

Read:

- .agents/AGENTS.md
- docs/GAME_DESIGN.md
- docs/ARCHITECTURE.md
- docs/ROADMAP.md

Read the relevant specialist skills before implementation.

First inspect the workspace and report what exists.

Then create a concise implementation plan for Phase 1 only.

Implement Phase 1:

- Playable true top-down 2D pixel-art world.
- Tile-based map.
- Two placeholder characters: Naufal and Lauren.
- Four-direction movement.
- Character collision.
- Camera pan and zoom.
- Observer HUD.
- World clock.
- Character information panels.

Use:

- eden-game-foundation
- phaser-pixel-art
- observer-ui
- quality-gates

Do not implement Gemini behavior yet.

Do not fake AI.
Do not create scripted conversations.
Do not create fake memories.

Keep game simulation independent from React UI.

Run:

- TypeScript checks
- Lint
- Tests
- Browser verification if available

Update docs/ROADMAP.md with actual status and known limitations.

Do not claim anything passed unless you actually ran it.

Do not just generate a plan. Actually implement Phase 1.

---

## Recommended Development Sequence

1. /plan-phase
2. /implement-phase
3. /implement-ai-agents
4. /test-simulation
5. /review-changes
6. /release-check

## Setup Notes

- Start with Phase 1.
- Do not make live Gemini calls during Phase 1.
- Use Node.js LTS.
- Use npm.
- Keep GEMINI_API_KEY server-side only.
- Configure GEMINI_MODEL using a currently supported Gemini model.
- Verify official documentation before implementing SDK-specific APIs.
