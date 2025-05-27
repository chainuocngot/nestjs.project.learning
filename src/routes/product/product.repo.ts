import { Injectable } from '@nestjs/common';
import {
  CreateProductBodyType,
  CreateProductResType,
  DeleteProductResType,
  GetProductDetailResType,
  GetProductsQueryType,
  GetProductsResType,
  ProductType,
  UpdateProductBodyType,
  UpdateProductResType,
} from 'src/routes/product/product.model';
import { SKUType } from 'src/routes/product/sku.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/common.constant';
import { LanguageType } from 'src/shared/models/shared-language.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(queries: GetProductsQueryType, languageId: LanguageType['id']): Promise<GetProductsResType> {
    const skip = queries.limit * (queries.page - 1);
    const take = queries.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.product.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.product.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          productTranslations: {
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
      limit: queries.limit,
      page: queries.page,
      totalPages: Math.ceil(totalItems / queries.limit),
    };
  }

  findById(productId: ProductType['id'], languageId: LanguageType['id']): Promise<GetProductDetailResType | null> {
    return this.prismaService.product.findUnique({
      where: {
        id: productId,
        deletedAt: null,
      },
      include: {
        productTranslations: {
          where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
        },
        skus: {
          where: {
            deletedAt: null,
          },
        },
        brand: {
          include: {
            brandTranslations: {
              where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
            },
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          include: {
            categoryTranslations: {
              where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
            },
          },
        },
      },
    });
  }

  create(body: CreateProductBodyType, createdById: UserType['id']): Promise<CreateProductResType> {
    const { skus, categories, ...productBody } = body;

    return this.prismaService.product.create({
      data: {
        ...productBody,
        createdById,
        categories: {
          connect: categories.map((category) => ({ id: category })),
        },
        skus: {
          createMany: {
            data: skus,
          },
        },
      },
      include: {
        productTranslations: {
          where: {
            deletedAt: null,
          },
        },
        skus: {
          where: {
            deletedAt: null,
          },
        },
        brand: {
          include: {
            brandTranslations: {
              where: { deletedAt: null },
            },
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          include: {
            categoryTranslations: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }

  async update({
    body,
    productId,
    updatedById,
  }: {
    body: UpdateProductBodyType;
    productId: ProductType['id'];
    updatedById: UserType['id'];
  }): Promise<UpdateProductResType> {
    const { skus: dataSkus, categories, ...productBody } = body;

    const existingSKUs = await this.prismaService.sKU.findMany({
      where: {
        productId,
        deletedAt: null,
      },
    });

    const skusToDelete = existingSKUs.filter((sku) => dataSkus.every((dataSku) => dataSku.value !== sku.value));
    const skuIdsToDelete = skusToDelete.map((sku) => sku.id);

    const skusWithId = dataSkus.map((dataSku) => {
      const existingSku = existingSKUs.find((existingSKU) => existingSKU.value === dataSku.value);
      return {
        ...dataSku,
        id: existingSku ? existingSku.id : null,
      };
    });

    const skusToUpdate = skusWithId.filter((sku) => sku.id !== null);

    const skusToCreate = skusWithId
      .filter((sku) => sku.id === null)
      .map((sku) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = sku;
        return { ...data, productId, createdById: updatedById };
      });

    const [product] = await this.prismaService.$transaction([
      //Update Product
      this.prismaService.product.update({
        where: {
          id: productId,
          deletedAt: null,
        },
        data: {
          ...productBody,
          updatedById,
          categories: {
            connect: categories.map((category) => ({ id: category })),
          },
        },
      }),
      //Delete SKU (sort)
      this.prismaService.sKU.updateMany({
        where: {
          id: {
            in: skuIdsToDelete,
          },
        },
        data: {
          deletedAt: new Date(),
          updatedById,
        },
      }),
      //Update SKU
      ...skusToUpdate.map((sku) =>
        this.prismaService.sKU.update({
          where: {
            id: sku.id as SKUType['id'],
          },
          data: {
            value: sku.value,
            price: sku.price,
            stock: sku.stock,
            image: sku.image,
            updatedById,
            updatedAt: new Date(),
          },
        }),
      ),
      //Create SKU
      this.prismaService.sKU.createMany({
        data: skusToCreate,
      }),
    ]);

    return product;
  }

  async delete(
    { id, deletedById }: { id: ProductType['id']; deletedById: UserType['id'] },
    isHard?: boolean,
  ): Promise<DeleteProductResType> {
    if (isHard) {
      const [product] = await Promise.all([
        this.prismaService.product.delete({
          where: {
            id,
          },
        }),
        this.prismaService.sKU.deleteMany({
          where: {
            productId: id,
          },
        }),
      ]);

      return product;
    }

    const now = new Date();
    const [product] = await Promise.all([
      this.prismaService.product.update({
        data: {
          deletedAt: now,
          deletedById,
        },
        where: {
          id,
          deletedAt: null,
        },
      }),
      this.prismaService.sKU.updateMany({
        data: {
          deletedAt: now,
          deletedById,
        },
        where: {
          productId: id,
          deletedAt: null,
        },
      }),
    ]);

    return product;
  }
}
