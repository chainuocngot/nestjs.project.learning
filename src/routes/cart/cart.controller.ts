import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  AddToCartBodyDTO,
  AddToCartResDTO,
  DeleteCartBodyDTO,
  GetCartItemParamsDTO,
  GetCartResDTO,
  UpdateCartBodyDTO,
  UpdateCartResDTO,
} from 'src/routes/cart/cart.dto';
import { CartService } from 'src/routes/cart/cart.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ZodSerializerDto(GetCartResDTO)
  list(@Param() pagination: PaginationQueryDTO, @ActiveUser('userId') userId: UserType['id']) {
    return this.cartService.list(pagination, userId);
  }

  @Post()
  @ZodSerializerDto(AddToCartResDTO)
  addToCart(@Body() body: AddToCartBodyDTO, @ActiveUser('userId') userId: UserType['id']) {
    return this.cartService.addToCart(body, userId);
  }

  @Put(':cartItemId')
  @ZodSerializerDto(UpdateCartResDTO)
  updateCart(@Body() body: UpdateCartBodyDTO, @Param() params: GetCartItemParamsDTO) {
    return this.cartService.updateCart(body, params.cartItemId);
  }

  @Post('delete')
  @ZodSerializerDto(MessageResDTO)
  delete(@Body() body: DeleteCartBodyDTO, @ActiveUser('userId') userId: UserType['id']) {
    return this.cartService.delete(body, userId);
  }
}
