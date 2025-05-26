import { Injectable } from '@nestjs/common';
import {
  CategoryOrLanguageNotFoundException,
  CategoryTranslationAlreadyExistsException,
} from 'src/routes/category/category-translation/category-translation.error';
import {
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType,
} from 'src/routes/category/category-translation/category-translation.model';
import { CategoryTranslationRepository } from 'src/routes/category/category-translation/category-translation.repo';
import { NotFoundRecordException } from 'src/shared/error';
import {
  isForeignKeyConstrainPrismaError,
  isNotFoundPrismaError,
  isUniqueConstrainPrismaError,
} from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { CategoryTranslationType } from 'src/shared/models/shared-category-translation';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class CategoryTranslationService {
  constructor(private readonly categoryTranslationRepository: CategoryTranslationRepository) {}

  findAll(pagination: PaginationQueryType) {
    return this.categoryTranslationRepository.findAll(pagination);
  }

  async findById(categoryTranslationId: CategoryTranslationType['id']) {
    const categoryTranslation = await this.categoryTranslationRepository.findById(categoryTranslationId);

    if (!categoryTranslation) {
      throw NotFoundRecordException;
    }

    return categoryTranslation;
  }

  async create(body: CreateCategoryTranslationBodyType, createdById: UserType['id']) {
    try {
      const categoryTranslation = await this.categoryTranslationRepository.create(body, createdById);

      return categoryTranslation;
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw CategoryTranslationAlreadyExistsException;
      }
      if (isForeignKeyConstrainPrismaError(error)) {
        throw CategoryOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateCategoryTranslationBodyType;
    id: CategoryTranslationType['id'];
    updatedById: UserType['id'];
  }) {
    try {
      const categoryTranslation = await this.categoryTranslationRepository.update({
        body,
        id,
        updatedById,
      });

      return categoryTranslation;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstrainPrismaError(error)) {
        throw CategoryTranslationAlreadyExistsException;
      }
      if (isForeignKeyConstrainPrismaError(error)) {
        throw CategoryOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async delete(categoryTranslationId: CategoryTranslationType['id'], deletedById: UserType['id']) {
    try {
      await this.categoryTranslationRepository.delete(
        {
          id: categoryTranslationId,
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
