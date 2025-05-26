import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { CreateBrandBodyType, UpdateBrandBodyType } from 'src/routes/brand/brand.model';
import { BrandRepository } from 'src/routes/brand/brand.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError } from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { BrandType } from 'src/shared/models/shared-brand.model';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  findAll(pagination: PaginationQueryType) {
    return this.brandRepository.findAll(pagination, I18nContext.current()?.lang as string);
  }

  async findById(brandId: BrandType['id']) {
    const brand = await this.brandRepository.findById(brandId, I18nContext.current()?.lang as string);

    if (!brand) {
      throw NotFoundRecordException;
    }

    return brand;
  }

  create(body: CreateBrandBodyType, createdById: UserType['id']) {
    return this.brandRepository.create(body, createdById);
  }

  async update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateBrandBodyType;
    id: BrandType['id'];
    updatedById: UserType['id'];
  }) {
    try {
      const brand = await this.brandRepository.update({ body, id, updatedById });

      return brand;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete(brandId: BrandType['id'], deletedById: UserType['id']) {
    try {
      await this.brandRepository.delete(
        {
          id: brandId,
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
