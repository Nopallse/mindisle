---
name: autonomous-agent-behavior
description: Designs and implements believable autonomous character behavior, personality, needs, emotions, goals, perception, action selection, and social dynamics for EDEN.
---

# Autonomous Agent Behavior

## Responsibilities

Build believable autonomous behavior.

## Principles

- Personality is a tendency, not a script.
- Needs influence decision priorities.
- Goals influence action selection.
- Emotions are simulated appraisal variables.
- Behavior must be grounded in perception.
- Agents may choose idle.
- Failed actions must trigger reconsideration.
- Avoid repetitive conversations.
- Avoid endless wandering.

## Decision Architecture

Use a hybrid approach.

Deterministic systems calculate:

- Distances.
- Visibility.
- Needs.
- Environmental constraints.
- Available actions.

Gemini reasons about:

- Social decisions.
- Exploration.
- Goal selection.
- Ambiguous situations.
- Contextual responses.

The deterministic policy layer validates every action.

## Character State

Separate stable and mutable data.

Stable:

- Identity.
- Personality.
- Initial traits.

Mutable:

- Needs.
- Emotional appraisal.
- Goals.
- Relationships.
- Current activity.

Episodic:

- Observations.
- Experiences.
- Conversations.

Private:

- Internal thoughts.
- Private memories.

## Behavior Loop

1. Observe environment.
2. Update needs.
3. Evaluate goals.
4. Retrieve relevant memories.
5. Ask Gemini when triggered.
6. Validate decision.
7. Execute action.
8. Record actual outcome.
9. Update state.

## Quality Checks

Test that Naufal and Lauren:

- Show different behavioral tendencies.
- Can initiate activities.
- Can change goals.
- Recover from failed actions.
- Avoid endless loops.
- Do not know hidden information.

Do not make either character completely predictable.
