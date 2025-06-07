import { OrderStatus } from 'src/shared/constants/order.constant';
import { ProductTranslationSchema } from 'src/shared/models/shared-product-translation.model';
import { z } from 'zod';

export const ReceiverSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
});

export const ProductTranslationsSchema = z.array(
  ProductTranslationSchema.pick({
    id: true,
    name: true,
    description: true,
    languageId: true,
  }),
);

export const OrderStatusSchema = z.nativeEnum(OrderStatus);

export const OrderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  status: OrderStatusSchema,
  receiver: ReceiverSchema,
  shopId: z.number().nullable(),
  paymentId: z.number(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),

  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ProductSKUSnapshotSchema = z.object({
  id: z.number(),
  productName: z.string().max(500),
  skuPrice: z.number(),
  image: z.string(),
  skuValue: z.string().max(500),
  skuId: z.number().nullable(),
  orderId: z.number().nullable(),
  quantity: z.number().int().positive(),
  productId: z.number().nullable(),
  productTranslations: ProductTranslationsSchema,

  createdAt: z.date(),
});

export const OrderWithProductSKUSnapshotSchema = OrderSchema.extend({
  items: z.array(ProductSKUSnapshotSchema),
});

export type ReceiverType = z.infer<typeof ReceiverSchema>;
export type ProductTranslationsType = z.infer<typeof ProductTranslationsSchema>;
export type OrderStatusType = z.infer<typeof OrderStatusSchema>;
export type OrderType = z.infer<typeof OrderSchema>;
export type ProductSKUSnapshotType = z.infer<typeof ProductSKUSnapshotSchema>;
export type OrderWithProductSKUSnapshotType = z.infer<typeof OrderWithProductSKUSnapshotSchema>;
