# EDEN — Initial Data Model

## Core Entities

### World

World identity and configuration.

### WorldState

Current world time, weather, and simulation state.

### Character

Stable character identity and world membership.

### CharacterPersonality

Personality traits and identity configuration.

### CharacterState

Position, facing, activity, needs, emotion state, and current action.

### CharacterGoal

Goal description, priority, status, and timestamps.

### CharacterMemory

Character-owned episodic and semantic memory.

### Conversation

Public conversation session.

### ConversationMessage

Executed public speech only.

### Relationship

Directed relationship state from one character to another.

### WorldEvent

Authoritative world event log.

### CharacterAction

Proposed, validated, and executed action audit record.

## Important Constraints

- Every private memory belongs to exactly one character.
- Index worldId.
- Index characterId.
- Index createdAt.
- Index status.
- Index memory retrieval paths.
- Use enums for controlled action and event types.
- Store timestamps in UTC.
- Render local time in the UI.
- Use JSON only for bounded and versioned payloads.
- Use database transactions where necessary.
- Never store API keys in the database.

## pgvector

Do not assume extension availability.

Verify Neon support and migration behavior before enabling vector storage.

Start with ordinary PostgreSQL filtering and retrieval if necessary.
