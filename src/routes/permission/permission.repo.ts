import { Injectable } from '@nestjs/common';
import {
  CreatePermissionBodyType,
  GetPermissionsResType,
  PermissionType,
} from 'src/routes/permission/permission.model';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(pagination: PaginationQueryType): Promise<GetPermissionsResType> {
    const skip = pagination.limit * (pagination.page - 1);
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.permission.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.permission.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
      }),
    ]);

    return {
      totalItems,
      data,
      limit: pagination.limit,
      page: pagination.page,
      totalPages: Math.ceil(totalItems / pagination.limit),
    };
  }

  findById(permissionId: PermissionType['id']): Promise<PermissionType | null> {
    return this.prismaService.permission.findUnique({
      where: {
        id: permissionId,
        deletedAt: null,
      },
    });
  }

  create(body: CreatePermissionBodyType, createdById: number): Promise<PermissionType> {
    return this.prismaService.permission.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({ body, id, updatedById }: { body: CreatePermissionBodyType; id: PermissionType['id']; updatedById: number }) {
    return this.prismaService.permission.update({
      data: {
        ...body,
        updatedById,
      },
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  delete({
    permissionId,
    deletedById,
    isHard,
  }: {
    permissionId: PermissionType['id'];
    deletedById: number;
    isHard?: boolean;
  }) {
    return isHard
      ? this.prismaService.permission.delete({
          where: {
            id: permissionId,
          },
        })
      : this.prismaService.permission.update({
          data: {
            deletedById,
            deletedAt: new Date(),
          },
          where: {
            id: permissionId,
            deletedAt: null,
          },
        });
  }
}
