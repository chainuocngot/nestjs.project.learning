import { CategoryTranslationSchema } from 'src/routes/category/category-translation/category-translation.model';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
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

export const GetCategoriesParamsSchema = PaginationQuerySchema.extend({
  parentCategoryId: z.coerce.number().int().positive().optional(),
}).strict();

export const GetCategoriesResSchema = z.object({
  data: z.array(CategoryWithTranslationSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetCategoryParamsSchema = z
  .object({
    categoryId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetCategoryDetailResSchema = CategorySchema;

export const CreateCategoryBodySchema = CategorySchema.pick({
  name: true,
  logo: true,
  parentCategoryId: true,
}).strict();

export const CreateCategoryResSchema = CategorySchema;

export const UpdateCategoryBodySchema = CreateCategoryBodySchema;

export const UpdateCategoryResSchema = CategorySchema;

export type CategoryType = z.infer<typeof CategorySchema>;
export type CategoryWithTranslationType = z.infer<typeof CategoryWithTranslationSchema>;
export type GetCategoriesParamsType = z.infer<typeof GetCategoriesParamsSchema>;
export type GetCategoriesResType = z.infer<typeof GetCategoriesResSchema>;
export type GetCategoryParamsType = z.infer<typeof GetCategoryParamsSchema>;
export type GetCategoryDetailResType = z.infer<typeof GetCategoryDetailResSchema>;
export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>;
export type CreateCategoryResType = z.infer<typeof CreateCategoryResSchema>;
export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>;
export type UpdateCategoryResType = z.infer<typeof UpdateCategoryResSchema>;
