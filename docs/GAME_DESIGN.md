# EDEN — Game Design Document

## High Concept

EDEN is a persistent, observer-first, top-down 2D pixel-art simulation.

Two autonomous simulated characters, Naufal and Lauren, inhabit a small world.

They perceive their surroundings, form goals, choose actions, communicate, remember experiences, and develop relationships through interaction with each other and the environment.

The player begins as an observer.

The player does not directly control the characters in the MVP.

## Game Design Pillars

### 1. Autonomy

Characters can initiate actions without player commands.

### 2. Continuity

Meaningful experiences persist across sessions.

### 3. Grounded Behavior

Actions obey deterministic world rules.

### 4. Individuality

Naufal and Lauren have different traits and private memories.

### 5. Legibility

The observer UI explains visible actions, public dialogue, status, and event history.

### 6. Small-World Depth

A small map with meaningful interactions is better than a huge empty map.

## Camera and Art Direction

- True top-down 2D view.
- Directly above the map.
- Orthogonal grid/tilemap.
- Never isometric.
- Never side-view.
- Pixel-art style.
- Consistent tile and sprite scale.
- Four-direction character sprites.
- Initial map: grass clearing, trees, rocks, flowers, and a small pond.
- Walkable and blocked tiles must be explicit.

Use placeholder art until movement and map systems are verified.

## Initial Characters

### Naufal

Initial tendencies:

- Curious
- Adventurous
- Friendly
- Sometimes impulsive

### Lauren

Initial tendencies:

- Observant
- Thoughtful
- Cautious
- Introverted
- Curious

These are behavioral tendencies, not hard-coded dialogue or fixed scripts.

Traits should influence decisions gradually.

## Character Simulation Model

Each character has:

- Stable identity
- Personality traits
- Current location
- Current facing direction
- Current activity
- Needs
- Emotional appraisal state
- Short-term context
- Episodic memories
- Goals
- Relationships
- Decision history

## Initial Action Vocabulary

- idle
- wander
- move_to
- look_at
- speak
- interact
- explore
- rest

Every action must be validated by the simulation.

Unknown or invalid actions must be rejected safely.

## Observer Interface

- Central game canvas.
- Character sidebar.
- World clock.
- Pause and speed controls.
- Public world event log.
- Character inspection panel.
- Conversation history.
- Optional developer inspection mode.

Private thoughts must never be confused with public dialogue.

## MVP Non-Goals

- Multiplayer.
- Combat.
- Survival crafting.
- Procedural infinite world.
- Voice synthesis.
- Real-time voice conversations.
- Character reproduction.
- Claims of sentience or consciousness.
- Autonomous code execution.

## Success Definition

A player can open the world and observe two distinct characters moving around a small map.

In later phases, characters should initiate plausible actions and conversations grounded in what each character can observe and remember.
