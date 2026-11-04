# Mindisle Workflow: Plan a Feature

Use this workflow before implementing any non-trivial capability, subsystem, or mechanic.

## Steps

1. **Understand Intent & Causality**:
   - What need, motivation, or simulation invariant does this feature serve?
   - How does this feature interact with the Causality Engine?
   - Does this feature allow characters to imagine things without magically spawning them?

2. **Identify Skills & Architectural Boundaries**:
   - Game presentation (`eden-game-foundation`, `phaser-pixel-art`)
   - Simulation & Causality (`simulation-systems`, `causality-engine`)
   - Creative & Assets (`creative-engine`, `pixel-art-generation`)
   - AI & Mind (`gemini-agent-engineering`, `autonomous-agent-behavior`, `knowledge-and-learning`)
   - Storage (`firebase-world-database`, `firebase-asset-persistence`)

3. **Draft the Specification**:
   - Data structures and Zod validation schemas.
   - Deterministic rules vs AI creative decisions.
   - Fallbacks and error paths.
   - Grounded memories and provenance records generated.

4. **Define Test Scenarios**:
   - Write out expected assertions before writing code.
   - Identify which of Scenarios A through H are affected.

5. **Proceed to Implementation**:
   - Execute the smallest slice using `/implement-simulation-system` or relevant workflow.

