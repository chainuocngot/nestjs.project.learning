import { CategoryTranslationSchema } from 'src/shared/models/shared-category-translation';
import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  logo: z.string().max(1000).nullable(),
  parentCategoryId: z.number().nullable(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),

  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CategoryWithTranslationSchema = CategorySchema.extend({
  categoryTranslations: z.array(CategoryTranslationSchema),
});

export type CategoryType = z.infer<typeof CategorySchema>;
export type CategoryWithTranslationType = z.infer<typeof CategoryWithTranslationSchema>;
