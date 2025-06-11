import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductNotFoundException } from 'src/routes/cart/cart.error';
import {
  CannotCancelOrderException,
  NotFoundCartItemException,
  OrderNotFoundException,
  OutOfStockSKUException,
  SKUNotBelongToShopException,
} from 'src/routes/order/order.error';
import {
  CancelOrderResType,
  CreateOrderBodyType,
  CreateOrderResType,
  GetOrderDetailResType,
  GetOrdersQueryType,
  GetOrdersResType,
} from 'src/routes/order/order.model';
import { OrderProducer } from 'src/routes/order/order.producer';
import { OrderStatus } from 'src/shared/constants/order.constant';
import { PaymentStatus } from 'src/shared/constants/payment.constant';
import { isNotFoundPrismaError } from 'src/shared/helpers';
import { OrderType } from 'src/shared/models/shared-order.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderProducer: OrderProducer,
  ) {}

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
      const payment = await tx.payment.create({
        data: {
          status: PaymentStatus.Pending,
        },
      });
      const $orders = Promise.all(
        body.map((item) =>
          tx.order.create({
            data: {
              userId,
              status: OrderStatus.PendingPayment,
              receiver: item.receiver,
              createdById: userId,
              paymentId: payment.id,
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

      const $cartItem = tx.cartItem.deleteMany({
        where: {
          id: {
            in: allBodyCartItemIds,
          },
        },
      });

      const $sku = Promise.all(
        cartItems.map((item) =>
          tx.sKU.update({
            where: {
              id: item.id,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
        ),
      );

      const $addCancelPaymentJob = this.orderProducer.addCancelPaymentJob(payment.id);
      const [orders] = await Promise.all([$orders, $cartItem, $sku, $addCancelPaymentJob]);

      return orders;
    });

    return {
      data: orders,
    };
  }

  async findById(userId: UserType['id'], orderId: OrderType['id']): Promise<GetOrderDetailResType> {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw OrderNotFoundException;
    }

    return order;
  }

  async cancel(userId: UserType['id'], orderId: OrderType['id']): Promise<CancelOrderResType> {
    try {
      const order = await this.prismaService.order.findUniqueOrThrow({
        where: {
          id: orderId,
          userId,
          deletedAt: null,
        },
      });
      if (order?.status !== OrderStatus.PendingPayment) {
        throw CannotCancelOrderException;
      }

      const updatedOrder = await this.prismaService.order.update({
        where: {
          id: orderId,
          userId,
          deletedAt: null,
        },
        data: {
          status: OrderStatus.Cancelled,
          updatedById: userId,
        },
      });

      return updatedOrder;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw OrderNotFoundException;
      }

      throw error;
    }
  }
}
