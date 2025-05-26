import { BrandTranslationSchema } from 'src/shared/models/shared-brand-translation';
import { z } from 'zod';

export const GetBrandTranslationsSchema = z.object({
  data: z.array(BrandTranslationSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetBrandTranslationParamsSchema = z
  .object({
    brandTranslationId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetBrandTranslationDetailResSchema = BrandTranslationSchema;

export const CreateBrandTranslationBodySchema = BrandTranslationSchema.pick({
  brandId: true,
  languageId: true,
  name: true,
  description: true,
}).strict();

export const CreateBrandTranslationResSchema = BrandTranslationSchema;

export const UpdateBrandTranslationBodySchema = CreateBrandTranslationBodySchema;

export const UpdateBrandTranslationResSchema = BrandTranslationSchema;

export type GetBrandTranslationsType = z.infer<typeof GetBrandTranslationsSchema>;
export type GetBrandTranslationParamsType = z.infer<typeof GetBrandTranslationParamsSchema>;
export type GetBrandTranslationDetailResType = z.infer<typeof GetBrandTranslationDetailResSchema>;
export type CreateBrandTranslationBodyType = z.infer<typeof CreateBrandTranslationBodySchema>;
export type CreateBrandTranslationResType = z.infer<typeof CreateBrandTranslationResSchema>;
export type UpdateBrandTranslationBodyType = z.infer<typeof UpdateBrandTranslationBodySchema>;
export type UpdateBrandTranslationResType = z.infer<typeof UpdateBrandTranslationResSchema>;
