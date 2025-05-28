import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.model';
import { SKUSchema, UpsertSKUBodySchema } from 'src/routes/product/sku.model';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { BrandWithTranslationSchema } from 'src/shared/models/shared-brand.model';
import { CategoryWithTranslationSchema } from 'src/shared/models/shared-category';
import { z } from 'zod';

function generateSKUs(variants: VariantsType) {
  // Hàm hỗ trợ để tạo tất cả tổ hợp
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => `${x}${x ? '-' : ''}${y}`)), ['']);
  }

  // Lấy mảng các options từ variants
  const options = variants.map((variant) => variant.options);

  // Tạo tất cả tổ hợp
  const combinations = getCombinations(options);

  // Chuyển tổ hợp thành SKU objects
  return combinations.map((value) => ({
    value,
    price: 0,
    stock: 100,
    image: '',
  }));
}

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

/**
 * For client and guess
 */
export const GetProductsQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  brandIds: z.array(z.coerce.number().int().positive()).optional(),
  categories: z.array(z.coerce.number().int()).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  createdById: z.coerce.number().positive().optional(),
}).strict();

/**
 * For admin and seller
 */
export const GetManageProductsQuerySchema = GetProductsQuerySchema.extend({
  isPublic: z.preprocess((value) => value === 'true', z.boolean()).optional(),
  createdById: z.coerce.number().positive(),
}).strict();

export const GetProductsResSchema = z.object({
  data: z.array(
    ProductSchema.extend({
      productTranslations: z.array(ProductTranslationSchema),
    }),
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetProductParamsSchema = z
  .object({
    productId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetProductDetailResSchema = ProductSchema.extend({
  productTranslations: z.array(ProductTranslationSchema),
  skus: z.array(SKUSchema),
  categories: z.array(CategoryWithTranslationSchema),
  brand: BrandWithTranslationSchema,
});

export const CreateProductBodySchema = ProductSchema.pick({
  publishedAt: true,
  name: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true,
})
  .extend({
    categories: z.array(z.coerce.number().int().positive()),
    skus: z.array(UpsertSKUBodySchema),
  })
  .superRefine(({ variants, skus }, ctx) => {
    // Kiểm tra xem số lượng SKU có hợp lệ hay không
    const skuValueArray = generateSKUs(variants);
    if (skus.length !== skuValueArray.length) {
      return ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: `Số lượng SKU nên là ${skuValueArray.length}. Vui lòng kiểm tra lại.`,
      });
    }

    // Kiểm tra từng SKU có hợp lệ hay không
    let wrongSKUIndex = -1;
    const isValidSKUs = skus.every((sku, index) => {
      const isValid = sku.value === skuValueArray[index].value;
      if (!isValid) {
        wrongSKUIndex = index;
      }
      return isValid;
    });
    if (!isValidSKUs) {
      ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: `Giá trị SKU index ${wrongSKUIndex} không hợp lệ. Vui lòng kiểm tra lại.`,
      });
    }
  });

export const CreateProductResSchema = GetProductDetailResSchema;

export const UpdateProductBodySchema = CreateProductBodySchema;

export const UpdateProductResSchema = ProductSchema;

export const DeleteProductResSchema = ProductSchema;

export type VariantType = z.infer<typeof VariantSchema>;
export type VariantsType = z.infer<typeof VariantsSchema>;
export type ProductType = z.infer<typeof ProductSchema>;
export type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>;
export type GetManageProductsQueryType = z.infer<typeof GetManageProductsQuerySchema>;
export type GetProductsResType = z.infer<typeof GetProductsResSchema>;
export type GetProductParamsType = z.infer<typeof GetProductParamsSchema>;
export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>;
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>;
export type CreateProductResType = z.infer<typeof CreateProductResSchema>;
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>;
export type UpdateProductResType = z.infer<typeof UpdateProductResSchema>;
export type DeleteProductResType = z.infer<typeof DeleteProductResSchema>;
