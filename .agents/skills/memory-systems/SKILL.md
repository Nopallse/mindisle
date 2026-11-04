---
name: memory-systems
description: Builds EDEN character-owned short-term, episodic, semantic, and long-term memory, retrieval, consolidation, persistence, and memory privacy.
---

# EDEN Memory Systems

## Responsibilities

Build persistent memory for each AI character.

## Memory Types

### 1. Working Memory

Recent observations and current context.

### 2. Episodic Memory

Specific experiences with timestamp and location.

### 3. Semantic Memory

Compact facts learned from repeated or reliable experiences.

### 4. Relationship Memory

Character-specific beliefs about other characters, supported by actual events.

## Required Metadata

Each memory should include:

- Owner character.
- Source event.
- Created timestamp.
- Location if available.
- Memory type.
- Importance.
- Confidence.
- Visibility policy.
- Content.
- Embedding when available.

## Rules

- Memories must originate from real events.
- Never save hallucinations as facts.
- Never allow Naufal to retrieve Lauren's private memories.
- Never allow Lauren to retrieve Naufal's private memories.
- Do not store every minor movement.
- Prefer meaningful experiences.
- Preserve source references.
- Avoid duplicate memories.

## Retrieval

Retrieve memories based on:

- Character ownership.
- Relevance.
- Recency.
- Importance.
- Context.

Use bounded memory retrieval.

## Consolidation

Periodically:

- Identify important experiences.
- Merge redundant memories.
- Preserve important events.
- Create compact summaries.
- Keep provenance.

## Implementation

1. Define memory types.
2. Persist episodic records.
3. Implement character-specific retrieval.
4. Add consolidation.
5. Add embeddings if justified.
6. Test privacy isolation.
7. Test restart recall.

## Acceptance

Naufal can remember his own past experiences after restart.

Lauren cannot access Naufal's private memories.
