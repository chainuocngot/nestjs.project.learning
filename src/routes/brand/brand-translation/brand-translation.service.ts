import { Injectable } from '@nestjs/common';
import {
  BrandOrLanguageNotFoundException,
  BrandTranslationAlreadyExistsException,
} from 'src/routes/brand/brand-translation/brand-translation.error';
import {
  BrandTranslationType,
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType,
} from 'src/routes/brand/brand-translation/brand-translation.model';
import { BrandTranslationRepository } from 'src/routes/brand/brand-translation/brand-translation.repo';
import { NotFoundRecordException } from 'src/shared/error';
import {
  isForeignKeyConstrainPrismaError,
  isNotFoundPrismaError,
  isUniqueConstrainPrismaError,
} from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class BrandTranslationService {
  constructor(private readonly brandTranslationRepository: BrandTranslationRepository) {}

  findAll(pagination: PaginationQueryType) {
    return this.brandTranslationRepository.findAll(pagination);
  }

  async findById(brandTranslationId: BrandTranslationType['id']) {
    const brandTranslation = await this.brandTranslationRepository.findById(brandTranslationId);

    if (!brandTranslation) {
      throw NotFoundRecordException;
    }

    return brandTranslation;
  }

  async create(body: CreateBrandTranslationBodyType, createdById: UserType['id']) {
    try {
      const brandTranslation = await this.brandTranslationRepository.create(body, createdById);

      return brandTranslation;
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException;
      }
      if (isForeignKeyConstrainPrismaError(error)) {
        throw BrandOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateBrandTranslationBodyType;
    id: BrandTranslationType['id'];
    updatedById: UserType['id'];
  }) {
    try {
      const brandTranslation = await this.brandTranslationRepository.update({
        body,
        id,
        updatedById,
      });

      return brandTranslation;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstrainPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException;
      }
      if (isForeignKeyConstrainPrismaError(error)) {
        throw BrandOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async delete(brandTranslationId: BrandTranslationType['id'], deletedById: UserType['id']) {
    try {
      await this.brandTranslationRepository.delete(
        {
          id: brandTranslationId,
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
