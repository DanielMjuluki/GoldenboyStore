import { z } from 'zod';

export const productStatusSchema = z.enum(['active', 'inactive', 'draft']);

export const productPayloadSchema = z.object({
  id: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1, 'Product name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  priceCents: z
    .number()
    .int('Price must be a whole number of cents')
    .nonnegative('Price cannot be negative'),
  currency: z.string().trim().length(3, 'Currency must be a 3-letter code').default('ZAR'),
  categoryIds: z.array(z.string().trim().min(1)).default([]),
  images: z.array(z.string().trim().min(1)).default([]),
  sizes: z.array(z.string().trim().min(1)).default([]),
  colors: z.array(z.string().trim().min(1)).default([]),
  stockQuantity: z.number().int().nonnegative().nullable().default(null),
  status: productStatusSchema.default('active'),
});

export const productUpdateSchema = productPayloadSchema.partial().omit({ id: true });

export type ProductPayload = z.infer<typeof productPayloadSchema>;
export type ProductUpdatePayload = z.infer<typeof productUpdateSchema>;
