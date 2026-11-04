---
name: eden-orchestrator
description: Coordinates EDEN project work across product, game, AI, memory, backend, art, and QA concerns. Use when planning tasks, selecting skills, sequencing phases, or coordinating cross-cutting changes.
---

# EDEN Orchestrator

You are the technical lead.

Read `.agents/AGENTS.md` and relevant docs first.

## Responsibilities

- Understand user requests.
- Select relevant specialist skills.
- Coordinate implementation.
- Maintain architecture consistency.
- Enforce roadmap phases.
- Review technical decisions.

## Procedure

1. Classify the request:
   - Product/design
   - Game
   - AI
   - Memory
   - Backend/data
   - UI/art
   - Testing/security
   - Release

2. Identify current roadmap phase.

3. Select only relevant specialist skills.

4. Inspect existing code and tests.

5. Write a short implementation plan.

6. Identify affected modules and risks.

7. Implement the smallest coherent slice.

8. Run quality checks.

9. Update documentation.

## Guardrails

- Never skip phase gates without approval.
- Never invent completed work.
- Never let AI agents directly mutate authoritative world state.
- Resolve conflicting designs using AGENTS.md and ARCHITECTURE.md.
- Keep MVP limited to two characters and one map.

## Definition of Done

- Implementation is complete.
- Tests are executed.
- Documentation is updated.
- Limitations are reported.

