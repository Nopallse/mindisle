import { z } from 'zod';

export const PixelMatrixSchema = z.object({
  width: z.number().int().min(8).max(64),
  height: z.number().int().min(8).max(64),
  palette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).min(2).max(32),
  data: z.array(z.array(z.number().int().nonnegative())),
});

export const ObjectSpecificationSchema = z.object({
  name: z.string().min(2).max(60),
  category: z.enum(['furniture', 'tool', 'structure', 'decoration', 'machine']),
  pixelWidth: z.number().int().min(8).max(64),
  pixelHeight: z.number().int().min(8).max(64),
  materials: z.array(
    z.object({
      materialId: z.string().min(1),
      count: z.number().int().positive(),
    })
  ).min(1),
  collision: z.object({
    solid: z.boolean(),
    width: z.number().min(0.2).max(3.0),
    height: z.number().min(0.2).max(3.0),
  }),
  interaction: z.enum(['rest', 'inspect', 'harvest', 'shelter', 'none']),
  pixelMatrix: PixelMatrixSchema,
});

export type ValidatedObjectSpecification = z.infer<typeof ObjectSpecificationSchema>;

export function validateObjectSpecification(raw: unknown): {
  success: boolean;
  data?: ValidatedObjectSpecification;
  error?: string;
} {
  const res = ObjectSpecificationSchema.safeParse(raw);
  if (res.success) {
    return { success: true, data: res.data };
  }
  const issues = res.error.issues || (res.error as any).errors || [];
  return {
    success: false,
    error: issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
  };
}
