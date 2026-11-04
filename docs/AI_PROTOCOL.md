# Mindisle — AI Agent Protocol & Schemas

## 1. Character Isolation Invariant

Naufal and Lauren operate as strictly independent cognitive agents.

Each agent request includes:
- Isolated character system prompt (personality archetype, traits, speaking voice).
- Private physiological needs and active motivations.
- Permitted local observations (only entities within vision/hearing range).
- Private episodic memories retrieved for the current context.
- Private knowledge and belief graph.

**Neither character can access or perceive the other's internal thoughts, private memories, or unobserved actions.**

---

## 2. Structured Decision Schema (Zod)

Every decision request sent to Gemini is validated against a versioned Zod schema.

```typescript
import { z } from 'zod';

export const ActionTypeSchema = z.enum([
  'IDLE',
  'MOVE',
  'GATHER',
  'INSPECT',
  'SPEAK',
  'PROPOSE_INVENTION',
  'START_CONSTRUCTION',
  'CONSTRUCT_STEP',
]);

export const AgentDecisionProposalSchema = z.object({
  schemaVersion: z.literal(2),
  requestId: z.string().uuid(),
  characterId: z.enum(['naufal', 'lauren']),
  
  // Private Cognition
  internalThought: z.string().min(1).max(500),
  activeMotivation: z.string().min(1).max(200),
  simulatedEmotion: z.object({
    valence: z.number().min(-1.0).max(1.0),
    arousal: z.number().min(0.0).max(1.0),
    label: z.string(),
  }),
  
  // Physical Action Proposal (Untrusted)
  action: z.object({
    type: ActionTypeSchema,
    targetTile: z.object({ x: z.number().int(), y: z.number().int() }).optional(),
    interactionEntityId: z.string().optional(),
    dialogue: z.string().max(280).nullable().optional(),
  }),
  
  // Optional Creative Proposal
  creativeProposal: z.object({
    objectName: z.string().min(3).max(60),
    category: z.enum(['furniture', 'tool', 'structure', 'decoration', 'machine']),
    inspiration: z.string().max(300),
    estimatedMaterials: z.array(z.object({
      materialId: z.string(),
      count: z.number().int().positive(),
    })),
  }).optional(),
  
  // Grounded Memory Candidate
  memoryCandidate: z.object({
    content: z.string().min(5).max(300),
    importance: z.number().min(1).max(10),
    confidence: z.number().min(0.0).max(1.0),
  }).optional(),
});
```

---

## 3. Protocol Rules & Guardrails

1. **Internal Thought is Strictly Private**: `internalThought` is never rendered in public chat bubbles or broadcast to other characters.
2. **Speech Becomes Public Only Upon Execution**: Spoken dialogue is emitted as a public event only if the `SPEAK` action passes range and cooldown validation.
3. **No Direct World Mutation**:
   - If Gemini outputs: *"I have placed a table here"*, the simulation engine does **not** create the table.
   - It treats the response as a `PROPOSE_INVENTION` request, which must go through the 14-step Causality Engine lifecycle.
4. **Range & Collision Enforcement**:
   - Movement targets must be adjacent or reachable via A* pathfinding.
   - Interaction targets must be within Manhattan distance $\le 1$ or $\le 2$ tiles.
5. **Safe Deterministic Fallback**:
   - If Gemini times out (>5000ms), returns invalid JSON, or triggers a rate limit, the orchestrator substitutes a fallback decision:
     ```json
     {
       "schemaVersion": 2,
       "internalThought": "Pausing to take a breath and observe the surroundings.",
       "action": { "type": "IDLE" }
     }
     ```
