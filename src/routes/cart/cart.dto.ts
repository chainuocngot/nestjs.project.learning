import { createZodDto } from 'nestjs-zod';
import {
  AddToCartBodySchema,
  AddToCartResSchema,
  CartItemDetailSchema,
  CartItemSchema,
  DeleteCartBodySchema,
  GetCartItemParamsSchema,
  GetCartResSchema,
  UpdateCartBodySchema,
  UpdateCartResSchema,
} from 'src/routes/cart/cart.model';

export class CartItemDTO extends createZodDto(CartItemSchema) {}

export class GetCartItemParamsDTO extends createZodDto(GetCartItemParamsSchema) {}

export class CartItemDetailDTO extends createZodDto(CartItemDetailSchema) {}

export class GetCartResDTO extends createZodDto(GetCartResSchema) {}

export class AddToCartBodyDTO extends createZodDto(AddToCartBodySchema) {}

export class AddToCartResDTO extends createZodDto(AddToCartResSchema) {}

export class UpdateCartBodyDTO extends createZodDto(UpdateCartBodySchema) {}

export class UpdateCartResDTO extends createZodDto(UpdateCartResSchema) {}

export class DeleteCartBodyDTO extends createZodDto(DeleteCartBodySchema) {}
