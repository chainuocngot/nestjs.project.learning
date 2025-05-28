import { z } from 'zod';

export const VariantSchema = z.object({
  value: z.string().trim(),
  options: z.array(z.string().trim()),
});

export const VariantsSchema = z.array(VariantSchema).superRefine((variants, ctx) => {
  // Kiểm tra variants và variant option có bị trùng hay không
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const isExistingVariant = variants.findIndex((v) => v.value.toLowerCase() === variant.value.toLowerCase()) !== i;
    if (isExistingVariant) {
      return ctx.addIssue({
        code: 'custom',
        message: `The value "${variant.value}" already exists in the variants list. Please check again.`,
        path: ['variants'],
      });
    }
    const isDifferentOption = variant.options.some((option, index) => {
      const isExistingOption = variant.options.findIndex((o) => o.toLowerCase() === option.toLowerCase()) !== index;
      return isExistingOption;
    });
    if (isDifferentOption) {
      return ctx.addIssue({
        code: 'custom',
        message: `Variant "${variant.value}" contains duplicate option names. Please check again.`,
        path: ['variants'],
      });
    }
  }
});

export const ProductSchema = z.object({
  id: z.number(),
  publishedAt: z.coerce.date().nullable(),
  name: z.string().max(500).trim(),
  basePrice: z.number().min(0),
  virtualPrice: z.number().min(0),
  brandId: z.number().int().positive(),
  images: z.array(z.string()),
  variants: VariantsSchema,

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),

  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type VariantType = z.infer<typeof VariantSchema>;
export type VariantsType = z.infer<typeof VariantsSchema>;
export type ProductType = z.infer<typeof ProductSchema>;
