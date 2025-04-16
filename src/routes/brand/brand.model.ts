import { BrandTranslationSchema } from 'src/routes/brand/brand-translation/brand-translation.model';
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

export type BrandType = z.infer<typeof BrandSchema>;
export type BrandWithTranslationType = z.infer<typeof BrandWithTranslationSchema>;
export type GetBrandsResType = z.infer<typeof GetBrandsResSchema>;
export type GetBrandParamsType = z.infer<typeof GetBrandParamsSchema>;
export type GetBrandDetailResType = z.infer<typeof GetBrandDetailResSchema>;
export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>;
export type CreateBrandResType = z.infer<typeof CreateBrandResSchema>;
export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>;
export type UpdateBrandResType = z.infer<typeof UpdateBrandResSchema>;
