import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { AddToCartBodyType, CartItemType, DeleteCartBodyType, UpdateCartBodyType } from 'src/routes/cart/cart.model';
import { CartRepository } from 'src/routes/cart/cart.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError } from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  list(pagination: PaginationQueryType, userId: UserType['id']) {
    return this.cartRepository.list({
      pagination,
      languageId: I18nContext.current()?.lang as string,
      userId,
    });
  }

  addToCart(body: AddToCartBodyType, userId: UserType['id']) {
    return this.cartRepository.addToCart(body, userId);
  }

  async updateCart(body: UpdateCartBodyType, cartItemId: CartItemType['id'], userId: UserType['id']) {
    try {
      const cart = await this.cartRepository.updateCart(body, cartItemId, userId);

      return cart;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete(body: DeleteCartBodyType, userId: UserType['id']) {
    const { count } = await this.cartRepository.delete(body, userId);

    return {
      message: `${count} item(s) deleted from cart`,
    };
  }
}
