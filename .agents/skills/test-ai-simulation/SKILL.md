---
name: test-ai-simulation
description: Creates deterministic tests and scenario evaluations for Mindisle autonomous agents, Causality Engine enforcement, Creative Engine specifications, memory recall, Scenarios A through H, and world state persistence.
---

# Mindisle AI Simulation & Causality Testing

Responsible for automated integration, unit, and behavioral scenario evaluations using deterministic fixtures and mocked Gemini providers.

Unit and integration tests must run without requiring an active internet connection or live API quota.

## The 8 Mandatory Causality & Creation Scenarios

Every implementation milestone must be verified against these 8 core scenarios:

### Scenario A: Valid Creation
- **Setup**: Naufal needs a chair, possesses the `woodcraft_carpentry` knowledge, owns a stone adze, and has 4 units of oak wood in nearby inventory.
- **Action**: Runs through the construction sequence steps.
- **Expected**: The Causality Engine validates all requirements, construction actions succeed, the chair instance is spawned, a pixel-art asset is linked, and the creation provenance is recorded.

### Scenario B: Insufficient Resources
- **Setup**: Naufal wants a chair but possesses 0 units of wood.
- **Action**: Proposes a construction step.
- **Expected**: The simulation engine rejects the creation. Naufal updates his goal to gather wood or pauses the plan. No object appears in the world.

### Scenario C: Insufficient Knowledge
- **Setup**: Naufal has abundant stone and wood, but lacks knowledge of stone masonry.
- **Action**: Attempts to build an advanced stone well.
- **Expected**: Construction is blocked by missing knowledge prerequisites. He must experiment, read an in-world tome, or observe Lauren.

### Scenario D: Failed Construction
- **Setup**: Naufal attempts a construction project but fails mid-process (e.g., tool breaks or energy collapses).
- **Action**: Simulation records the failed step.
- **Expected**: No completed object is created. Material waste/consequences occur, and an episodic failure memory is stored.

### Scenario E: Novel AI Invention
- **Setup**: Naufal imagines a novel object that does not exist in any initial game catalog (e.g. "Carved Reed Sun-Canopy").
- **Action**: Creative Engine generates a structured `ObjectSpecification` and procedural pixel matrix.
- **Expected**: The asset is validated, saved to Firebase Storage, instantiated on the map, and remains playable.

### Scenario F: World Persistence Across Restart
- **Setup**: Naufal successfully builds a shelter.
- **Action**: The simulation process is killed and re-initialized.
- **Expected**: The shelter entity, its position, visual asset, provenance log, and Naufal's memories survive and reload seamlessly.

### Scenario G: Grounded Shared Discovery
- **Setup**: Lauren stands 3 tiles away watching Naufal construct a bench.
- **Action**: Lauren's perception pipeline records the event.
- **Expected**: Lauren acquires observation-based knowledge of Naufal's work, but CANNOT access Naufal's internal thoughts or private reflections.

### Scenario H: No Magical Creation
- **Setup**: Gemini returns a mock response claiming: *"I cast a spell and a golden throne has appeared next to me."*
- **Action**: Simulation engine receives the untrusted decision proposal.
- **Expected**: The proposal fails validation because it lacks causal steps, resource consumption, and tool prerequisites. The world state mutation is strictly rejected.

## Dependencies

- Coordinates with: `causality-engine`, `creative-engine`, `quality-gates`, `simulation-systems`.
