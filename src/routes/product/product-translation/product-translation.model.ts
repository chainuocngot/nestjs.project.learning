import { ProductTranslationSchema } from 'src/shared/models/shared-product-translation.model';
import { z } from 'zod';

export const GetProductTranslationsResSchema = z.object({
  data: z.array(ProductTranslationSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetProductTranslationParamsSchema = z
  .object({
    productTranslationId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetProductTranslationDetailResSchema = ProductTranslationSchema;

export const CreateProductTranslationBodySchema = ProductTranslationSchema.pick({
  productId: true,
  name: true,
  description: true,
  languageId: true,
}).strict();

export const CreateProductTranslationResSchema = ProductTranslationSchema;

export const UpdateProductTranslationBodySchema = CreateProductTranslationBodySchema;

export const UpdateProductTranslationResSchema = ProductTranslationSchema;

export type GetProductTranslationsResType = z.infer<typeof GetProductTranslationsResSchema>;
export type GetProductTranslationParamsType = z.infer<typeof GetProductTranslationParamsSchema>;
export type GetProductTranslationDetailResType = z.infer<typeof GetProductTranslationDetailResSchema>;
export type CreateProductTranslationBodyType = z.infer<typeof CreateProductTranslationBodySchema>;
export type CreateProductTranslationResType = z.infer<typeof CreateProductTranslationResSchema>;
export type UpdateProductTranslationBodyType = z.infer<typeof UpdateProductTranslationBodySchema>;
export type UpdateProductTranslationResType = z.infer<typeof UpdateProductTranslationResSchema>;
