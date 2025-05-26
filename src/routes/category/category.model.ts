import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { CategorySchema, CategoryWithTranslationSchema } from 'src/shared/models/shared-category';
import { z } from 'zod';

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

export type GetCategoriesParamsType = z.infer<typeof GetCategoriesParamsSchema>;
export type GetCategoriesResType = z.infer<typeof GetCategoriesResSchema>;
export type GetCategoryParamsType = z.infer<typeof GetCategoryParamsSchema>;
export type GetCategoryDetailResType = z.infer<typeof GetCategoryDetailResSchema>;
export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>;
export type CreateCategoryResType = z.infer<typeof CreateCategoryResSchema>;
export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>;
export type UpdateCategoryResType = z.infer<typeof UpdateCategoryResSchema>;
