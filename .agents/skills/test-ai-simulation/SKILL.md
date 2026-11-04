---
name: test-ai-simulation
description: Creates deterministic tests and scenario evaluations for EDEN autonomous agents, Gemini decisions, memory recall, social interaction, action execution, and emergent simulation behavior.
---

# AI Simulation Testing

## Responsibilities

Test autonomous behavior and simulation invariants.

Prefer deterministic fixtures and mocked Gemini responses.

Live Gemini tests must be optional, budget-limited, and explicitly configured.

## Required Scenarios

### Scenario 1
Character chooses a valid reachable action.

### Scenario 2
Character receives only its own private memory.

### Scenario 3
Agent cannot know an unseen object.

### Scenario 4
Character responds to audible public dialogue.

### Scenario 5
Character cannot hear dialogue outside hearing range.

### Scenario 6
Failed movement creates a new observation and does not teleport.

### Scenario 7
Stale AI response is ignored.

### Scenario 8
Gemini timeout triggers safe fallback.

### Scenario 9
Repeated identical decisions are cooled down.

### Scenario 10
Restart restores persisted state and grounded memories.

## Emergence Evaluation

Run multiple seeded scenarios.

Evaluate:

- Action diversity.
- Goal persistence.
- Personality influence.
- Social initiation.
- Social response.
- Memory-grounded recall.
- Recovery from failure.
- Absence of endless loops.

Do not require one exact conversation.

Evaluate behavioral properties and invariants instead.

## Reporting

Record:
- Scenario.
- Seed.
- Mocked model response.
- Expected invariant.
- Actual result.
- Failure details.

