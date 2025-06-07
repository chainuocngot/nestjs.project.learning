import { PaginationQuerySchema } from 'src/shared/models/request.model';
import {
  OrderSchema,
  OrderStatusSchema,
  ProductSKUSnapshotSchema,
  ReceiverSchema,
} from 'src/shared/models/shared-order.model';
import { z } from 'zod';

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

export type GetOrdersResType = z.infer<typeof GetOrdersResSchema>;
export type GetOrdersQueryType = z.infer<typeof GetOrdersQuerySchema>;
export type GetOrderParamType = z.infer<typeof GetOrderParamSchema>;
export type GetOrderDetailResType = z.infer<typeof GetOrderDetailResSchema>;
export type CreateOrderBodyType = z.infer<typeof CreateOrderBodySchema>;
export type CreateOrderResType = z.infer<typeof CreateOrderResSchema>;
export type CancelOrderResType = z.infer<typeof CancelOrderResSchema>;
