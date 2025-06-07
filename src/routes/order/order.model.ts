import { OrderStatus } from 'src/shared/constants/order.constant';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
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

export const GetOrdersResSchema = z.object({
  data: z.array(
    OrderSchema.extend({
      items: z.array(ProductSKUSnapshotSchema),
    }).omit({
      receiver: true,
      deletedAt: true,
      deletedById: true,
      createdById: true,
      updatedById: true,
    }),
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetOrdersQuerySchema = PaginationQuerySchema.extend({
  status: OrderStatusSchema.optional(),
}).strict();

export const GetOrderParamSchema = z
  .object({
    orderId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetOrderDetailResSchema = OrderSchema.extend({
  items: z.array(ProductSKUSnapshotSchema),
});

export const CreateOrderBodySchema = z.array(
  z.object({
    shopId: z.number(),
    receiver: ReceiverSchema,
    cartItemIds: z.array(z.number()).min(1),
  }),
);

export const CreateOrderResSchema = z.object({
  data: z.array(OrderSchema),
});

export const CancelOrderResSchema = OrderSchema;

export type ReceiverType = z.infer<typeof ReceiverSchema>;
export type ProductTranslationsType = z.infer<typeof ProductTranslationsSchema>;
export type OrderStatusType = z.infer<typeof OrderStatusSchema>;
export type OrderType = z.infer<typeof OrderSchema>;
export type ProductSKUSnapshotType = z.infer<typeof ProductSKUSnapshotSchema>;
export type GetOrdersResType = z.infer<typeof GetOrdersResSchema>;
export type GetOrdersQueryType = z.infer<typeof GetOrdersQuerySchema>;
export type GetOrderParamType = z.infer<typeof GetOrderParamSchema>;
export type GetOrderDetailResType = z.infer<typeof GetOrderDetailResSchema>;
export type CreateOrderBodyType = z.infer<typeof CreateOrderBodySchema>;
export type CreateOrderResType = z.infer<typeof CreateOrderResSchema>;
export type CancelOrderResType = z.infer<typeof CancelOrderResSchema>;
