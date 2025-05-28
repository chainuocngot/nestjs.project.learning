import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.model';
import { ProductSchema } from 'src/shared/models/shared-product.model';
import { SKUSchema } from 'src/shared/models/shared-sku.model';
import { z } from 'zod';

export const CartItemSchema = z.object({
  id: z.number(),
  quantity: z.number().int().positive(),
  skuId: z.number(),
  userId: z.number(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCartItemParamsSchema = z.object({
  cartItemId: z.coerce.number().int().positive(),
});

export const CartItemDetailSchema = CartItemSchema.extend({
  sku: SKUSchema.extend({
    product: ProductSchema.extend({
      productTranslations: z.array(ProductTranslationSchema),
    }),
  }),
});
