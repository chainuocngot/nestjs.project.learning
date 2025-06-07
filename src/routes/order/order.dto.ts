import { createZodDto } from 'nestjs-zod';
import {
  CancelOrderResSchema,
  CreateOrderBodySchema,
  CreateOrderResSchema,
  GetOrderDetailResSchema,
  GetOrderParamSchema,
  GetOrdersQuerySchema,
  GetOrdersResSchema,
} from 'src/routes/order/order.model';
import {
  OrderSchema,
  ProductSKUSnapshotSchema,
  ProductTranslationsSchema,
  ReceiverSchema,
} from 'src/shared/models/shared-order.model';

export class ReceiverDTO extends createZodDto(ReceiverSchema) {}

export class ProductTranslationsDTO extends createZodDto(ProductTranslationsSchema) {}

export class OrderDTO extends createZodDto(OrderSchema) {}

export class ProductSKUSnapshotDTO extends createZodDto(ProductSKUSnapshotSchema) {}

export class GetOrdersResDTO extends createZodDto(GetOrdersResSchema) {}

export class GetOrdersQueryDTO extends createZodDto(GetOrdersQuerySchema) {}

export class GetOrderParamDTO extends createZodDto(GetOrderParamSchema) {}

export class GetOrderDetailResDTO extends createZodDto(GetOrderDetailResSchema) {}

export class CreateOrderBodyDTO extends createZodDto(CreateOrderBodySchema) {}

export class CreateOrderResDTO extends createZodDto(CreateOrderResSchema) {}

export class CancelOrderResDTO extends createZodDto(CancelOrderResSchema) {}
