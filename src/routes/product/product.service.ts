import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { BrandOrCategoryNotFoundException } from 'src/routes/product/product.error';
import {
  CreateProductBodyType,
  GetProductsQueryType,
  ProductType,
  UpdateProductBodyType,
} from 'src/routes/product/product.model';
import { ProductRepository } from 'src/routes/product/product.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { isForeignKeyConstrainPrismaError, isNotFoundPrismaError } from 'src/shared/helpers';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  list(queries: GetProductsQueryType) {
    return this.productRepository.list(queries, I18nContext.current()?.lang as string);
  }

  async findById(productId: ProductType['id']) {
    const product = await this.productRepository.findById(productId, I18nContext.current()?.lang as string);

    if (!product) {
      throw NotFoundRecordException;
    }

    return product;
  }

  async create(body: CreateProductBodyType, createdById: UserType['id']) {
    try {
      const product = await this.productRepository.create(body, createdById);

      return product;
    } catch (error) {
      if (isForeignKeyConstrainPrismaError(error)) {
        throw BrandOrCategoryNotFoundException;
      }

      throw error;
    }
  }

  async update({
    body,
    productId,
    updatedById,
  }: {
    body: UpdateProductBodyType;
    productId: ProductType['id'];
    updatedById: UserType['id'];
  }) {
    try {
      const product = await this.productRepository.update({
        body,
        productId,
        updatedById,
      });

      return product;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete(productId: ProductType['id'], deletedById: UserType['id']) {
    try {
      await this.productRepository.delete({
        id: productId,
        deletedById,
      });

      return {
        message: 'Delete successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      return error;
    }
  }
}
