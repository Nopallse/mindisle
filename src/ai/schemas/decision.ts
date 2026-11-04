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

export const SimulatedEmotionSchema = z.object({
  valence: z.number().min(-1.0).max(1.0),
  arousal: z.number().min(0.0).max(1.0),
  label: z.string().min(1).max(50),
});

export const ProposedActionSchema = z.object({
  type: ActionTypeSchema,
  targetTile: z
    .object({
      x: z.number().int().min(0).max(29),
      y: z.number().int().min(0).max(19),
    })
    .optional(),
  interactionEntityId: z.string().optional(),
  dialogue: z.string().max(280).nullable().optional(),
});

export const CreativeProposalSchema = z.object({
  objectName: z.string().min(2).max(60),
  category: z.enum(['furniture', 'tool', 'structure', 'decoration', 'machine']),
  inspiration: z.string().max(300),
  estimatedMaterials: z.array(
    z.object({
      materialId: z.string().min(1),
      count: z.number().int().positive(),
    })
  ),
});

export const MemoryCandidateSchema = z.object({
  content: z.string().min(5).max(300),
  importance: z.number().min(1).max(10),
  confidence: z.number().min(0.0).max(1.0),
});

export const AgentDecisionProposalSchema = z.object({
  schemaVersion: z.literal(2),
  requestId: z.string().min(1),
  characterId: z.enum(['naufal', 'lauren']),
  internalThought: z.string().min(1).max(500),
  activeMotivation: z.string().min(1).max(200),
  simulatedEmotion: SimulatedEmotionSchema,
  action: ProposedActionSchema,
  creativeProposal: CreativeProposalSchema.optional(),
  memoryCandidate: MemoryCandidateSchema.optional(),
});

export type ValidatedDecisionProposal = z.infer<typeof AgentDecisionProposalSchema>;

export function parseDecisionProposal(raw: unknown): {
  success: boolean;
  data?: ValidatedDecisionProposal;
  error?: string;
} {
  const result = AgentDecisionProposalSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const issues = result.error.issues || (result.error as any).errors || [];
  return {
    success: false,
    error: issues.map((e: any) => `${e.path?.join('.') || 'root'}: ${e.message}`).join(', '),
  };
}
