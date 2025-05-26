import { BrandSchema, BrandWithTranslationSchema } from 'src/shared/models/shared-brand.model';
import { z } from 'zod';

export const GetBrandsResSchema = z.object({
  data: z.array(BrandWithTranslationSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetBrandParamsSchema = z
  .object({
    brandId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetBrandDetailResSchema = BrandSchema;

export const CreateBrandBodySchema = BrandSchema.pick({
  logo: true,
  name: true,
}).strict();

export const CreateBrandResSchema = BrandSchema;

export const UpdateBrandBodySchema = CreateBrandBodySchema;

export const UpdateBrandResSchema = BrandSchema;

export type GetBrandsResType = z.infer<typeof GetBrandsResSchema>;
export type GetBrandParamsType = z.infer<typeof GetBrandParamsSchema>;
export type GetBrandDetailResType = z.infer<typeof GetBrandDetailResSchema>;
export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>;
export type CreateBrandResType = z.infer<typeof CreateBrandResSchema>;
export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>;
export type UpdateBrandResType = z.infer<typeof UpdateBrandResSchema>;
