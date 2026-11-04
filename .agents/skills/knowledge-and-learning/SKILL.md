---
name: knowledge-and-learning
description: Models character-isolated epistemic states, learning mechanisms, belief confidence, knowledge acquisition sources, and social knowledge transfer for Mindisle characters.
---

# Mindisle Knowledge & Learning

Responsible for character epistemic graphs: what characters know, what they believe, what they suspect, and how they learn over time.

## Epistemic Hierarchy

Characters do not possess a flat, omniscient database of the world. Every piece of knowledge carries a certainty level:

1. **Known Fact (`confidence >= 0.9`)**: Grounded in direct personal observation, successful physical experimentation, or proven construction.
2. **Belief (`0.5 <= confidence < 0.9`)**: Learned from a trusted peer in conversation or read from a book without personal verification.
3. **Suspicion / Hypothesis (`0.2 <= confidence < 0.5`)**: Inferred from indirect clues (e.g. noticing sawdust near the riverbank and suspecting Naufal is building something there).
4. **Unknown / Unexperienced (`confidence < 0.2`)**: The character has never seen, heard, or inferred this concept and cannot act upon it.

## Knowledge Transfer Channels

Knowledge cannot teleport between characters. It transfers only through logical in-world interactions:
- **Direct Observation**: Character A stands within perception range while Character B executes a craft.
- **Dialogue & Discussion**: Character B explains a craft recipe to Character A in an executed `SPEAK` action within hearing distance.
- **Physical Artifacts**: A character discovers an inscribed wooden sign, manual, or diary left in the world.
- **Trial & Error Experimentation**: A character combines materials, fails or succeeds, and records the resulting recipe with confidence calibrated by the outcome.

## Data Contract

```typescript
interface CharacterKnowledgeItem {
  id: string;
  characterId: 'naufal' | 'lauren';
  subject: string; // e.g. "oak_wood_properties" or "recipe_carved_chair"
  confidence: number; // 0.0 to 1.0
  acquisitionSource: 'direct_experience' | 'observation' | 'conversation' | 'book' | 'inference';
  sourceCharacterId?: string; // If learned from someone else
  evidenceEventIds: string[]; // WorldEvent provenance
  acquiredAt: number; // UTC timestamp
  lastAppliedAt?: number;
}
```

## Dependencies

- Coordinates with: `causality-engine`, `memory-systems`, `gemini-agent-engineering`, `autonomous-agent-behavior`.

