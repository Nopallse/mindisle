---
name: memory-systems
description: Builds Mindisle character-owned short-term, episodic, semantic, and reflective memory, retrieval, consolidation, Firestore persistence, and character privacy isolation.
---

# Mindisle Memory Systems

Responsible for character-owned memory storage, retrieval, reflection, consolidation, and privacy boundaries.

## Responsibilities

- Character-isolated episodic, semantic, working, and reflective memories.
- Storing memories in Firestore subcollections: `worlds/{worldId}/characters/{characterId}/memories/{memoryId}`.
- Contextual retrieval based on Recency, Importance, Relevance, and Epistemic Confidence.
- Periodic memory consolidation and reflective summarization.
- Strict privacy enforcement: Naufal cannot query Lauren's memories and vice versa.

## Memory Types & Data Contract

```typescript
interface CharacterMemory {
  id: string;
  characterId: 'naufal' | 'lauren';
  type: 'episodic' | 'semantic' | 'reflection' | 'creative';
  content: string;
  importance: number; // 1 to 10
  confidence: number; // 0.0 to 1.0
  sourceEventId?: string; // Provenance link to actual WorldEvent
  sourceProjectId?: string; // Link to CreationProject if applicable
  location?: { x: number; y: number; landmark?: string };
  emotionalValence?: number; // -1.0 to 1.0
  createdAt: number; // UTC timestamp
  lastRecalledAt?: number;
}
```

## Architectural Rules

1. **Grounded Provenance**: Memories must originate from actual observations, executions, or conversations. Never record hallucinations as real memories.
2. **Strict Privacy**: Queries must always filter by `characterId`. An agent prompt context builder receives only memories owned by that specific character.
3. **Bounded Retrieval**: Do not load all memories into Gemini prompt contexts. Retrieve top $K$ (e.g. 5-8) most relevant memories by combining recency decay, importance weighting, and keyword/semantic match.
4. **Offline & Restart Persistence**: Memory documents must survive browser reloads and server restarts.

## Dependencies

- Coordinates with: `firebase-world-database`, `knowledge-and-learning`, `world-provenance`, `gemini-agent-engineering`.
