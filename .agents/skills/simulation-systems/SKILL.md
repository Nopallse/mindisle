---
name: simulation-systems
description: Implements EDEN's deterministic world clock, event bus, perception, navigation, action validation, execution, needs, environment, and simulation scheduler.
---

# EDEN Simulation Systems

## Responsibilities

Build the deterministic simulation layer.

Use when implementing:

- World state.
- World clock.
- Event bus.
- Perception.
- Navigation.
- Action validation.
- Action execution.
- Needs.
- Environment.
- Scheduler.

## Principles

- Simulation is authoritative.
- Rendering is presentation.
- Use a controlled simulation tick.
- Use typed events.
- Use explicit state transitions.
- Keep actions bounded and validated.
- AI output cannot bypass world constraints.

## Action Validation

Check:

- Supported action type.
- Target exists.
- Coordinates are in bounds.
- Target is walkable.
- Target is reachable.
- Character can perform the action.
- Interaction range.
- Line of sight where relevant.
- Cooldown.
- Concurrency.
- Stale decision status.

## Scheduler

- Event-driven triggers.
- Minimum and maximum thinking intervals.
- One in-flight decision per character.
- Deduplicate triggers.
- Reject stale results.
- Never block rendering.

## Perception

Expose only information within:

- Visibility range.
- Hearing range.
- Proximity.
- Public-world rules.

Never expose omniscient map information.

Never expose another agent's private thoughts.

## Acceptance

Movement, time, collision, and action outcomes must be authoritative.

Gemini failure must never stop the simulation.
