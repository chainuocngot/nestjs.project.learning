import { ForbiddenException, Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { BrandNotFoundException, CategoryNotFoundException } from 'src/routes/product/product.error';
import {
  CreateProductBodyType,
  GetManageProductsQueryType,
  UpdateProductBodyType,
} from 'src/routes/product/product.model';
import { ProductRepository } from 'src/routes/product/product.repo';
import { RoleName } from 'src/shared/constants/role.constant';
import { NotFoundRecordException } from 'src/shared/error';
import {
  isForeignKeyConstrainPrismaError,
  isNotFoundPrismaError,
  isQueryInterpretationPrismaError,
} from 'src/shared/helpers';
import { ProductType } from 'src/shared/models/shared-product.model';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class ManageProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  list(props: { queries: GetManageProductsQueryType; userIdRequest: UserType['id']; roleNameRequest: string }) {
    this.validatePrivilage({
      createdById: props.queries.createdById,
      roleNameRequest: props.roleNameRequest,
      userIdRequest: props.userIdRequest,
    });

    return this.productRepository.list({
      queries: props.queries,
      languageId: I18nContext.current()?.lang as string,
      isPublic: props.queries.isPublic,
    });
  }

  async getDetail(props: { productId: ProductType['id']; userIdRequest: UserType['id']; roleNameRequest: string }) {
    const product = await this.productRepository.getDetail({
      languageId: I18nContext.current()?.lang as string,
      productId: props.productId,
    });

    if (!product) {
      throw NotFoundRecordException;
    }

    this.validatePrivilage({
      createdById: product.createdById,
      roleNameRequest: props.roleNameRequest,
      userIdRequest: props.userIdRequest,
    });

    return product;
  }

  async create(body: CreateProductBodyType, createdById: UserType['id']) {
    try {
      const product = await this.productRepository.create(body, createdById);

      return product;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryNotFoundException;
      }

      if (isForeignKeyConstrainPrismaError(error)) {
        throw BrandNotFoundException;
      }

      throw error;
    }
  }

  async update({
    body,
    productId,
    updatedById,
    roleNameRequest,
  }: {
    body: UpdateProductBodyType;
    productId: ProductType['id'];
    updatedById: UserType['id'];
    roleNameRequest: string;
  }) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw NotFoundRecordException;
    }

    this.validatePrivilage({
      createdById: product.createdById,
      roleNameRequest: roleNameRequest,
      userIdRequest: updatedById,
    });

    try {
      const updatedProduct = await this.productRepository.update({
        body,
        productId,
        updatedById,
      });

      return updatedProduct;
    } catch (error) {
      if (isQueryInterpretationPrismaError(error)) {
        throw NotFoundRecordException;
      }
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete({
    productId,
    deletedById,
    roleNameRequest,
  }: {
    productId: ProductType['id'];
    deletedById: UserType['id'];
    roleNameRequest: string;
  }) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw NotFoundRecordException;
    }

    this.validatePrivilage({
      createdById: product.createdById,
      roleNameRequest: roleNameRequest,
      userIdRequest: deletedById,
    });

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

  /**
   * Check if user is creater or admin
   */
  private validatePrivilage({
    userIdRequest,
    roleNameRequest,
    createdById,
  }: {
    userIdRequest: UserType['id'];
    roleNameRequest: string;
    createdById: UserType['id'] | undefined | null;
  }) {
    if (userIdRequest !== createdById && roleNameRequest !== RoleName.Admin) {
      throw new ForbiddenException();
    }

    return true;
  }
}
