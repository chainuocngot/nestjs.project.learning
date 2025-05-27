import { Injectable } from '@nestjs/common';
import {
  CreateCategoryTranslationBodyType,
  GetCategoryTranslationDetailResType,
  GetCategoryTranslationsType,
  UpdateCategoryTranslationBodyType,
} from 'src/routes/category/category-translation/category-translation.model';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { CategoryTranslationType } from 'src/shared/models/shared-category-translation';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class CategoryTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: PaginationQueryType): Promise<GetCategoryTranslationsType> {
    const skip = pagination.limit * (pagination.page - 1);
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.categoryTranslation.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.categoryTranslation.findMany({
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

  findById(categoryTranslationId: CategoryTranslationType['id']): Promise<GetCategoryTranslationDetailResType | null> {
    return this.prismaService.categoryTranslation.findUnique({
      where: {
        id: categoryTranslationId,
        deletedAt: null,
      },
    });
  }

  create(body: CreateCategoryTranslationBodyType, createdById: UserType['id']) {
    return this.prismaService.categoryTranslation.create({
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
    body: UpdateCategoryTranslationBodyType;
    id: CategoryTranslationType['id'];
    updatedById: UserType['id'];
  }) {
    return this.prismaService.categoryTranslation.update({
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

  delete({ id, deletedById }: { id: CategoryTranslationType['id']; deletedById: UserType['id'] }, isHard?: boolean) {
    return isHard
      ? this.prismaService.categoryTranslation.delete({
          where: {
            id,
          },
        })
      : this.prismaService.categoryTranslation.update({
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
