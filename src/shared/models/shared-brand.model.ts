import { BrandTranslationSchema } from 'src/shared/models/shared-brand-translation';
import { z } from 'zod';

export const BrandSchema = z.object({
  id: z.number(),
  logo: z.string().max(1000),
  name: z.string().max(500),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),

  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BrandWithTranslationSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema),
});

export type BrandType = z.infer<typeof BrandSchema>;
export type BrandWithTranslationType = z.infer<typeof BrandWithTranslationSchema>;
