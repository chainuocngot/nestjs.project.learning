import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductNotFoundException, SKUNotFoundException, SKUOutOfStockException } from 'src/routes/cart/cart.error';
import {
  AddToCartBodyType,
  AddToCartResType,
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

  async findAll(props: {
    pagination: PaginationQueryType;
    userId: UserType['id'];
    languageId: LanguageType['id'];
  }): Promise<GetCartResType> {
    const skip = props.pagination.limit * (props.pagination.page - 1);
    const take = props.pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.cartItem.count({
        where: {
          userId: props.userId,
        },
      }),
      this.prismaService.cartItem.findMany({
        where: {
          userId: props.userId,
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
                },
              },
            },
          },
        },
        skip,
        take,
      }),
    ]);

    return {
      data,
      totalItems,
      limit: props.pagination.limit,
      page: props.pagination.page,
      totalPages: Math.ceil(totalItems / props.pagination.limit),
    };
  }

  async addToCart(body: AddToCartBodyType, userId: UserType['id']): Promise<AddToCartResType> {
    await this.validateSKU(body.skuId);

    return this.prismaService.cartItem.create({
      data: {
        ...body,
        userId,
        createdAt: new Date(),
      },
    });
  }

  async updateCart(body: UpdateCartBodyType, cartItemId: CartItemType['id']): Promise<UpdateCartResType> {
    await this.validateSKU(body.skuId);

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

  private async validateSKU(skuId: SKUType['id']): Promise<SKUType> {
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

    if (sku.stock < 1) {
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
