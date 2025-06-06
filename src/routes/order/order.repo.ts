import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductNotFoundException } from 'src/routes/cart/cart.error';
import {
  NotFoundCartItemException,
  OutOfStockSKUException,
  SKUNotBelongToShopException,
} from 'src/routes/order/order.error';
import {
  CreateOrderBodyType,
  CreateOrderResType,
  GetOrdersQueryType,
  GetOrdersResType,
} from 'src/routes/order/order.model';
import { OrderStatus } from 'src/shared/constants/order.constant';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(queries: GetOrdersQueryType, userId: UserType['id']): Promise<GetOrdersResType> {
    const skip = queries.limit * (queries.page - 1);
    const take = queries.limit;

    const where: Prisma.OrderWhereInput = {
      status: queries.status,
      userId,
    };

    const [totalItems, data] = await Promise.all([
      this.prismaService.order.count({
        where,
      }),
      this.prismaService.order.findMany({
        where,
        include: {
          items: true,
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      totalItems,
      data,
      limit: queries.limit,
      page: queries.page,
      totalPages: Math.ceil(totalItems / queries.limit),
    };
  }

  async create(body: CreateOrderBodyType, userId: UserType['id']): Promise<CreateOrderResType> {
    const allBodyCartItemIds = body.map((item) => item.cartItemIds).flat();
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        id: {
          in: allBodyCartItemIds,
        },
        userId,
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: true,
              },
            },
          },
        },
      },
    });

    if (allBodyCartItemIds.length !== cartItems.length) {
      throw NotFoundCartItemException;
    }

    const isOutOfStock = cartItems.some((item) => {
      return item.sku.stock < item.quantity;
    });
    if (isOutOfStock) {
      throw OutOfStockSKUException;
    }

    const isExistNotReadyProduct = cartItems.some(
      (item) =>
        item.sku.product.deletedAt !== null ||
        item.sku.product.publishedAt === null ||
        item.sku.product.publishedAt > new Date(),
    );
    if (isExistNotReadyProduct) {
      throw ProductNotFoundException;
    }

    const cartItemMap = new Map<number, (typeof cartItems)[0]>();
    cartItems.forEach((item) => {
      cartItemMap.set(item.id, item);
    });
    const isValidShop = body.every((item) => {
      const bodyCartItemIds = item.cartItemIds;
      return bodyCartItemIds.every((cartItemId) => {
        const cartItem = cartItemMap.get(cartItemId)!;

        return item.shopId === cartItem.sku.createdById;
      });
    });
    if (!isValidShop) {
      throw SKUNotBelongToShopException;
    }

    const orders = await this.prismaService.$transaction(async (tx) => {
      const orders = await Promise.all(
        body.map((item) =>
          tx.order.create({
            data: {
              userId,
              status: OrderStatus.PendingPayment,
              receiver: item.receiver,
              createdById: userId,
              items: {
                create: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!;

                  return {
                    productName: cartItem.sku.product.name,
                    skuPrice: cartItem.sku.price,
                    image: cartItem.sku.image,
                    skuId: cartItem.sku.id,
                    skuValue: cartItem.sku.value,
                    quantity: cartItem.quantity,
                    productId: cartItem.sku.product.id,
                    productTranslations: cartItem.sku.product.productTranslations.map((translation) => {
                      return {
                        id: translation.id,
                        name: translation.name,
                        description: translation.description,
                        languageId: translation.languageId,
                      };
                    }),
                  };
                }),
              },
              products: {
                connect: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!;

                  return {
                    id: cartItem.sku.product.id,
                  };
                }),
              },
            },
          }),
        ),
      );

      await tx.cartItem.deleteMany({
        where: {
          id: {
            in: allBodyCartItemIds,
          },
        },
      });

      return orders;
    });

    return {
      data: orders,
    };
  }
}
