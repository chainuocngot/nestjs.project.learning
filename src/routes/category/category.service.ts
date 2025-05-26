import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  CategoryType,
  CreateCategoryBodyType,
  GetCategoriesParamsType,
  UpdateCategoryBodyType,
} from 'src/routes/category/category.model';
import { CategoryRepository } from 'src/routes/category/category.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError } from 'src/shared/helpers';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  findAll(params: GetCategoriesParamsType) {
    const { parentCategoryId = null, ...pagination } = params;
    return this.categoryRepository.findAll({
      pagination: pagination,
      languageId: I18nContext.current()?.lang as string,
      parentCategoryId,
    });
  }

  async findById(categoryId: CategoryType['id']) {
    const category = await this.categoryRepository.findById(categoryId, I18nContext.current()?.lang as string);

    if (!category) {
      throw NotFoundRecordException;
    }

    return category;
  }

  create(body: CreateCategoryBodyType, createdById: UserType['id']) {
    return this.categoryRepository.create(body, createdById);
  }

  async update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateCategoryBodyType;
    id: CategoryType['id'];
    updatedById: UserType['id'];
  }) {
    try {
      const category = await this.categoryRepository.update({ body, id, updatedById });

      return category;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete(categoryId: CategoryType['id'], deletedById: UserType['id']) {
    try {
      await this.categoryRepository.delete(
        {
          id: categoryId,
          deletedById,
        },
        false,
      );

      return {
        message: 'Delete successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }
}
