import { z } from 'zod';

export const CategoryTranslationSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  languageId: z.string(),
  name: z.string().max(500),
  description: z.string(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),

  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCategoryTranslationsSchema = z.object({
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

export type CategoryTranslationType = z.infer<typeof CategoryTranslationSchema>;
export type GetCategoryTranslationsType = z.infer<typeof GetCategoryTranslationsSchema>;
export type GetCategoryTranslationParamsType = z.infer<typeof GetCategoryTranslationParamsSchema>;
export type GetCategoryTranslationDetailResType = z.infer<typeof GetCategoryTranslationDetailResSchema>;
export type CreateCategoryTranslationBodyType = z.infer<typeof CreateCategoryTranslationBodySchema>;
export type CreateCategoryTranslationResType = z.infer<typeof CreateCategoryTranslationResSchema>;
export type UpdateCategoryTranslationBodyType = z.infer<typeof UpdateCategoryTranslationBodySchema>;
export type UpdateCategoryTranslationResType = z.infer<typeof UpdateCategoryTranslationResSchema>;
