import { z } from 'zod';

export const SKUSchema = z.object({
  id: z.number(),
  value: z.string().max(500).trim(),
  price: z.number().min(0),
  stock: z.number().min(0),
  image: z.string(),
  productId: z.number(),

  createdById: z.number(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),

  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SKUType = z.infer<typeof SKUSchema>;
