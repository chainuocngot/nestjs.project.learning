import { CategoryTranslationSchema } from 'src/shared/models/shared-category-translation';
import { z } from 'zod';

export const GetCategoryTranslationsResSchema = z.object({
  data: z.array(CategoryTranslationSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetCategoryTranslationParamsSchema = z
  .object({
    categoryTranslationId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetCategoryTranslationDetailResSchema = CategoryTranslationSchema;

export const CreateCategoryTranslationBodySchema = CategoryTranslationSchema.pick({
  categoryId: true,
  languageId: true,
  name: true,
  description: true,
}).strict();

export const CreateCategoryTranslationResSchema = CategoryTranslationSchema;

export const UpdateCategoryTranslationBodySchema = CreateCategoryTranslationBodySchema;

export const UpdateCategoryTranslationResSchema = CategoryTranslationSchema;

export type GetCategoryTranslationsResType = z.infer<typeof GetCategoryTranslationsResSchema>;
export type GetCategoryTranslationParamsType = z.infer<typeof GetCategoryTranslationParamsSchema>;
export type GetCategoryTranslationDetailResType = z.infer<typeof GetCategoryTranslationDetailResSchema>;
export type CreateCategoryTranslationBodyType = z.infer<typeof CreateCategoryTranslationBodySchema>;
export type CreateCategoryTranslationResType = z.infer<typeof CreateCategoryTranslationResSchema>;
export type UpdateCategoryTranslationBodyType = z.infer<typeof UpdateCategoryTranslationBodySchema>;
export type UpdateCategoryTranslationResType = z.infer<typeof UpdateCategoryTranslationResSchema>;
