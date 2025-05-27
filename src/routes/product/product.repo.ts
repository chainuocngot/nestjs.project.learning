import { Injectable } from '@nestjs/common';
import { GetProductsQueryType, GetProductsResType } from 'src/routes/product/product.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/common.constant';
import { LanguageType } from 'src/shared/models/shared-language.model';
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
}
