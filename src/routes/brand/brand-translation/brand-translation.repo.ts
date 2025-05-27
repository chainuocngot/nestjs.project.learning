import { Injectable } from '@nestjs/common';
import {
  CreateBrandTranslationBodyType,
  GetBrandTranslationDetailResType,
  GetBrandTranslationsType,
  UpdateBrandTranslationBodyType,
} from 'src/routes/brand/brand-translation/brand-translation.model';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { BrandTranslationType } from 'src/shared/models/shared-brand-translation';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class BrandTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: PaginationQueryType): Promise<GetBrandTranslationsType> {
    const skip = pagination.limit * (pagination.page - 1);
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.brandTranslation.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.brandTranslation.findMany({
        where: {
          deletedAt: null,
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

  findById(brandTranslationId: BrandTranslationType['id']): Promise<GetBrandTranslationDetailResType | null> {
    return this.prismaService.brandTranslation.findUnique({
      where: {
        id: brandTranslationId,
        deletedAt: null,
      },
    });
  }

  create(body: CreateBrandTranslationBodyType, createdById: UserType['id']) {
    return this.prismaService.brandTranslation.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateBrandTranslationBodyType;
    id: BrandTranslationType['id'];
    updatedById: UserType['id'];
  }) {
    return this.prismaService.brandTranslation.update({
      data: {
        ...body,
        updatedById,
        updatedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  delete({ id, deletedById }: { id: BrandTranslationType['id']; deletedById: UserType['id'] }, isHard?: boolean) {
    return isHard
      ? this.prismaService.brandTranslation.delete({
          where: {
            id,
          },
        })
      : this.prismaService.brandTranslation.update({
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
