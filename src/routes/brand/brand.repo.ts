import { Injectable } from '@nestjs/common';
import { CreateBrandBodyType, GetBrandsResType, UpdateBrandBodyType } from 'src/routes/brand/brand.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/common.constant';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { BrandType, BrandWithTranslationType } from 'src/shared/models/shared-brand.model';
import { LanguageType } from 'src/shared/models/shared-language.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(pagination: PaginationQueryType, languageId: LanguageType['id']): Promise<GetBrandsResType> {
    const skip = pagination.limit * (pagination.page - 1);
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.brand.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.brand.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          brandTranslations: {
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

  findById(brandId: BrandType['id'], languageId: LanguageType['id']): Promise<BrandWithTranslationType | null> {
    return this.prismaService.brand.findUnique({
      where: {
        id: brandId,
        deletedAt: null,
      },
      include: {
        brandTranslations: {
          where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
        },
      },
    });
  }

  create(body: CreateBrandBodyType, createdById: UserType['id']): Promise<BrandWithTranslationType> {
    return this.prismaService.brand.create({
      data: {
        ...body,
        createdById,
      },
      include: {
        brandTranslations: {
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
    body: UpdateBrandBodyType;
    id: BrandType['id'];
    updatedById: UserType['id'];
  }): Promise<BrandWithTranslationType> {
    return this.prismaService.brand.update({
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
        brandTranslations: {
          where: { deletedAt: null },
        },
      },
    });
  }

  delete({ id, deletedById }: { id: BrandType['id']; deletedById: UserType['id'] }, isHard?: boolean) {
    return isHard
      ? this.prismaService.brand.delete({
          where: {
            id,
          },
        })
      : this.prismaService.brand.update({
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
