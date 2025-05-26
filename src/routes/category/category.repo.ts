import { Injectable } from '@nestjs/common';
import {
  CreateCategoryBodyType,
  GetCategoriesResType,
  UpdateCategoryBodyType,
} from 'src/routes/category/category.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/common.constant';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { CategoryType, CategoryWithTranslationType } from 'src/shared/models/shared-category';
import { LanguageType } from 'src/shared/models/shared-language.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({
    pagination,
    languageId,
    parentCategoryId,
  }: {
    pagination: PaginationQueryType;
    languageId: LanguageType['id'];
    parentCategoryId: CategoryType['parentCategoryId'];
  }): Promise<GetCategoriesResType> {
    const skip = pagination.limit * (pagination.page - 1);
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.category.count({
        where: {
          deletedAt: null,
          parentCategoryId: parentCategoryId ?? null,
        },
      }),
      this.prismaService.category.findMany({
        where: {
          deletedAt: null,
          parentCategoryId: parentCategoryId ?? null,
        },
        include: {
          categoryTranslations: {
            where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
          },
        },
        orderBy: {
          createdAt: 'desc',
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

  findById(categoryId: CategoryType['id'], languageId: LanguageType['id']) {
    return this.prismaService.category.findUnique({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      include: {
        categoryTranslations: {
          where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
        },
      },
    });
  }

  create(body: CreateCategoryBodyType, createdById: UserType['id']): Promise<CategoryWithTranslationType> {
    return this.prismaService.category.create({
      data: {
        ...body,
        createdById,
      },
      include: {
        categoryTranslations: {
          where: { deletedAt: null },
        },
      },
    });
  }

  update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateCategoryBodyType;
    id: CategoryType['id'];
    updatedById: UserType['id'];
  }): Promise<CategoryWithTranslationType> {
    return this.prismaService.category.update({
      data: {
        ...body,
        updatedById,
        updatedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
      },
      include: {
        categoryTranslations: {
          where: { deletedAt: null },
        },
      },
    });
  }

  delete({ id, deletedById }: { id: CategoryType['id']; deletedById: UserType['id'] }, isHard?: boolean) {
    return isHard
      ? this.prismaService.category.delete({
          where: {
            id,
          },
        })
      : this.prismaService.category.update({
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
