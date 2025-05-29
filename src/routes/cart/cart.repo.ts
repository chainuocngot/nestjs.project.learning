import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductNotFoundException, SKUNotFoundException, SKUOutOfStockException } from 'src/routes/cart/cart.error';
import {
  AddToCartBodyType,
  AddToCartResType,
  CartItemDetailType,
  CartItemType,
  DeleteCartBodyType,
  GetCartResType,
  UpdateCartBodyType,
  UpdateCartResType,
} from 'src/routes/cart/cart.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/common.constant';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { LanguageType } from 'src/shared/models/shared-language.model';
import { SKUType } from 'src/shared/models/shared-sku.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(props: {
    pagination: PaginationQueryType;
    userId: UserType['id'];
    languageId: LanguageType['id'];
  }): Promise<GetCartResType> {
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        userId: props.userId,
        sku: {
          product: {
            deletedAt: null,
            publishedAt: {
              lte: new Date(),
              not: null,
            },
          },
        },
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: {
                  where:
                    props.languageId === ALL_LANGUAGE_CODE
                      ? { deletedAt: null }
                      : { languageId: props.languageId, deletedAt: null },
                },
                createdBy: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const groupMap = new Map<number, CartItemDetailType>();

    for (const cartItem of cartItems) {
      const shopId = cartItem.sku.product.createdById;

      if (shopId) {
        if (!groupMap.has(shopId)) {
          groupMap.set(shopId, {
            shop: cartItem.sku.product.createdBy,
            cartItems: [],
          });
        }
        groupMap.get(shopId)?.cartItems.push(cartItem);
      }
    }

    const sortedGroups = Array.from(groupMap.values());

    const skip = props.pagination.limit * (props.pagination.page - 1);
    const take = props.pagination.limit;
    const totalGroups = sortedGroups.length;
    const pagedGroups = sortedGroups.slice(skip, skip + take);

    return {
      data: pagedGroups,
      totalItems: totalGroups,
      limit: props.pagination.limit,
      page: props.pagination.page,
      totalPages: Math.ceil(totalGroups / props.pagination.limit),
    };
  }

  async addToCart(body: AddToCartBodyType, userId: UserType['id']): Promise<AddToCartResType> {
    await this.validateSKU(body.skuId, body.quantity);

    return this.prismaService.cartItem.upsert({
      where: {
        userId_skuId: {
          userId,
          skuId: body.skuId,
        },
      },
      update: {
        quantity: {
          increment: body.quantity,
        },
      },
      create: {
        ...body,
        userId,
      },
    });
  }

  async updateCart(body: UpdateCartBodyType, cartItemId: CartItemType['id']): Promise<UpdateCartResType> {
    await this.validateSKU(body.skuId, body.quantity);

    return this.prismaService.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });
  }

  delete(body: DeleteCartBodyType, userId: UserType['id']): Promise<Prisma.BatchPayload> {
    return this.prismaService.cartItem.deleteMany({
      where: {
        id: {
          in: body.cartItemIds,
        },
        userId,
      },
    });
  }

  private async validateSKU(skuId: SKUType['id'], quantity: number): Promise<SKUType> {
    const sku = await this.prismaService.sKU.findUnique({
      where: {
        id: skuId,
        deletedAt: null,
      },
      include: {
        product: true,
      },
    });

    if (!sku) {
      throw SKUNotFoundException;
    }

    if (sku.stock < 1 || sku.stock < quantity) {
      throw SKUOutOfStockException;
    }

    const { product } = sku;

    if (
      product.deletedAt !== null ||
      product.publishedAt === null ||
      (product.publishedAt !== null && product.publishedAt > new Date())
    ) {
      throw ProductNotFoundException;
    }

    return sku;
  }
}
