---
name: autonomous-agent-behavior
description: Designs and implements believable autonomous character behavior, personality, needs, emotions, motivations, goals, perception, action selection, learning from failure, and social dynamics for Mindisle.
---

# Autonomous Agent Behavior

Responsible for creating believable, evolving character autonomy that reflects distinct personalities, motivations, and natural behavior.

## Core Principles

- **Personality is a Tendency, Not a Script**: Naufal tends toward exploration, tinkering, and physical experimentation; Lauren tends toward observation, botany, reflection, and quiet craft. Neither is locked to rigid canned responses.
- **Needs Drive Motivations**: Physical, cognitive, and social needs (energy, curiosity, comfort, companionship) create motivations to act, rest, explore, or build.
- **Inspiration from the World**: Characters form creative ideas when their active motivations cross paths with observed world objects, materials, and landmarks.
- **Learning from Failure**: When an action or construction fails (due to missing tools, inadequate knowledge, or bad weather), characters experience realistic consequences (frustration, fatigue) and form grounded memories to adapt their next plan.
- **Simulated Emotion Disclaimer**: Emotion state variables (valence, arousal, dominance) are deterministic psychological appraisal values, never labeled as genuine biological consciousness.

## Character Profiles

### Naufal
- **Archetype**: Pragmatic Explorer & Tinkerer.
- **Tendencies**: High curiosity, active exploration, physical construction experimentation, direct communication.
- **Default Motivations**: Understanding how things work, exploring uncharted tiles, crafting functional tools and sturdy shelter.

### Lauren
- **Archetype**: Thoughtful Botanist & Storyteller.
- **Tendencies**: Deep observation, empathy, careful reflection before action, aesthetic appreciation of nature.
- **Default Motivations**: Categorizing plant species, studying the lake ecosystem, crafting comfortable resting spaces and expressive decorations.

## Decision & Behavior Loop

1. **Perception**: Filter world state to within vision and hearing ranges.
2. **Needs Update**: Advance deterministic physiological decay (energy, hunger, curiosity).
3. **Motivation Appraisal**: Determine primary active urge.
4. **Memory & Knowledge Recall**: Retrieve relevant experiences, known material properties, and beliefs.
5. **Reasoning & Planning**: Invoke Gemini when a non-trivial goal or creative idea arises; decompose goal into causal steps.
6. **Execution & Consequence**: Execute verified action step; record physical results and update emotional state.

## Dependencies

- Coordinates with: `causality-engine`, `creative-engine`, `memory-systems`, `knowledge-and-learning`, `simulation-systems`.
