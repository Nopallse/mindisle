---
name: causality-engine
description: Enforces Mindisle's core philosophy ("Unlimited Imagination, Logical Execution") by validating that all world changes, crafts, and constructions have traceable causal chains from motivation to resource collection, step execution, and memory formation.
---

# Mindisle Causality Engine

The foundational architecture component that guarantees every meaningful change in the world has a logical, traceable cause.

## The Causality Chain

No object may appear in Mindisle magically. Every creation must progress through the 14-step causal chain:

```mermaid
flowchart TD
    S1[1. Need / Motivation Emergence] --> S2[2. Environmental Observation]
    S2 --> S3[3. Inspiration & Idea Formation]
    S3 --> S4[4. Project Planning & Blueprint]
    S4 --> S5[5. Knowledge & Skill Verification]
    S5 --> S6[6. Tool & Material Requirements Check]
    S6 --> S7[7. Resource Gathering in World]
    S7 --> S8[8. Construction Action Steps]
    S8 --> S9[9. Step Validation by Simulation Engine]
    S9 --> S10[10. Physical Object Instantiation]
    S10 --> S11[11. Pixel Art Asset Generation / Link]
    S11 --> S12[12. Firebase Persistence]
    S12 --> S13[13. Grounded Memory & Provenance Log]
    S13 --> S14[14. Shared World Recognition]
```

## Failure & Consequence Handling

If a character attempts to create something without fulfilling causal dependencies:
- **Missing Resources** (e.g., Naufal wants a chair but has 0 wood):
  - *Result*: Construction is rejected. Naufal experiences frustration, updates his goal to "Find wood", or abandons the project.
- **Missing Knowledge** (e.g., Naufal has stone and wood but doesn't know how to construct a stone well):
  - *Result*: Action fails. He must experiment, read an in-world book, or observe Lauren.
- **Failed Construction Step** (e.g., stamina exhausted or tool breaks mid-craft):
  - *Result*: Project remains partially constructed or ruins into scrap. A grounded episodic memory of the failure is recorded.

## Architectural Rules

1. **Veto Over LLM Output**: Even if Gemini hallucinates *"I have successfully created a chair"*, the Causality Engine checks active inventory and project state; if unfulfilled, the claim is rejected.
2. **Determinism over Complex Calls**: Resource checks, distance to workbenches, inventory counts, and tool degradation use fast, deterministic simulation rules.
3. **Traceable Provenance**: Every created object receives a `provenanceId` linking to its builder, materials, duration, and inspiration.

## Dependencies

- Coordinates with: `creative-engine`, `world-provenance`, `knowledge-and-learning`, `simulation-systems`, `firebase-world-database`.

