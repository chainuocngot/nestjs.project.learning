import { Injectable } from '@nestjs/common';
import {
  ProductOrLanguageNotFoundException,
  ProductTranslationAlreadyExistsException,
} from 'src/routes/product/product-translation/product-translation.error';
import {
  CreateProductTranslationBodyType,
  ProductTranslationType,
  UpdateProductTranslationBodyType,
} from 'src/routes/product/product-translation/product-translation.model';
import { ProductTranslationRepository } from 'src/routes/product/product-translation/product-translation.repo';
import { NotFoundRecordException } from 'src/shared/error';
import {
  isForeignKeyConstrainPrismaError,
  isNotFoundPrismaError,
  isUniqueConstrainPrismaError,
} from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class ProductTranslationService {
  constructor(private readonly productTranslationRepository: ProductTranslationRepository) {}

  list(pagination: PaginationQueryType) {
    return this.productTranslationRepository.list(pagination);
  }

  async findById(productTranslationId: ProductTranslationType['id']) {
    const productTranslation = await this.productTranslationRepository.findById(productTranslationId);

    if (!productTranslation) {
      throw NotFoundRecordException;
    }

    return productTranslation;
  }

  async create(body: CreateProductTranslationBodyType, createdById: UserType['id']) {
    try {
      const productTranslation = await this.productTranslationRepository.create(body, createdById);

      return productTranslation;
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw ProductTranslationAlreadyExistsException;
      }
      if (isForeignKeyConstrainPrismaError(error)) {
        throw ProductOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateProductTranslationBodyType;
    id: ProductTranslationType['id'];
    updatedById: UserType['id'];
  }) {
    try {
      const productTranslation = await this.productTranslationRepository.update({
        body,
        id,
        updatedById,
      });

      return productTranslation;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstrainPrismaError(error)) {
        throw ProductTranslationAlreadyExistsException;
      }
      if (isForeignKeyConstrainPrismaError(error)) {
        throw ProductOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async delete(productTranslationId: ProductTranslationType['id'], deletedById: UserType['id']) {
    try {
      await this.productTranslationRepository.delete(
        {
          id: productTranslationId,
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
