import { Injectable } from '@nestjs/common';
import {
  CreateProductTranslationBodyType,
  GetProductTranslationDetailResType,
  GetProductTranslationsResType,
  ProductTranslationType,
  UpdateProductTranslationBodyType,
} from 'src/routes/product/product-translation/product-translation.model';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProductTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: PaginationQueryType): Promise<GetProductTranslationsResType> {
    const skip = pagination.limit * (pagination.page - 1);
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.productTranslation.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.productTranslation.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
      }),
    ]);

    return {
      data,
      totalItems,
      limit: pagination.limit,
      page: pagination.page,
      totalPages: Math.ceil(totalItems / pagination.limit),
    };
  }

  findById(productTranslationId: ProductTranslationType['id']): Promise<GetProductTranslationDetailResType | null> {
    return this.prismaService.productTranslation.findUnique({
      where: {
        id: productTranslationId,
        deletedAt: null,
      },
    });
  }

  create(body: CreateProductTranslationBodyType, createdById: UserType['id']) {
    return this.prismaService.productTranslation.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateProductTranslationBodyType;
    id: ProductTranslationType['id'];
    updatedById: UserType['id'];
  }) {
    return this.prismaService.productTranslation.update({
      data: {
        ...body,
        updatedById,
        updatedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  delete({ id, deletedById }: { id: ProductTranslationType['id']; deletedById: UserType['id'] }, isHard?: boolean) {
    return isHard
      ? this.prismaService.productTranslation.delete({
          where: {
            id,
          },
        })
      : this.prismaService.productTranslation.update({
          data: {
            deletedAt: new Date(),
            deletedById,
          },
          where: {
            id,
            deletedAt: null,
          },
        });
  }
}
