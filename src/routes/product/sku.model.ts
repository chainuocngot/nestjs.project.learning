import { z } from 'zod';

export const SKUSchema = z.object({
  id: z.number(),
  value: z.string().max(500),
  price: z.number().positive(),
  stock: z.number(),
  image: z.string(),
  productId: z.number(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),

  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpsertSKUBodySchema = SKUSchema.pick({
  value: true,
  price: true,
  stock: true,
  image: true,
});

export type SKUType = z.infer<typeof SKUSchema>;
export type UpsertSKUBodyType = z.infer<typeof UpsertSKUBodySchema>;
