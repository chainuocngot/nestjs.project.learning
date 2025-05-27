import { Injectable } from '@nestjs/common';
import {
  CreateRoleBodyType,
  GetRolesResType,
  RoleWithPermissionsType,
  UpdateRoleBodyType,
} from 'src/routes/role/role.model';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { RoleType } from 'src/shared/models/shared-role.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: PaginationQueryType): Promise<GetRolesResType> {
    const skip = pagination.limit * (pagination.page - 1);
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.role.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.role.findMany({
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

  findById(roleId: RoleType['id']): Promise<RoleWithPermissionsType | null> {
    return this.prismaService.role.findUnique({
      where: {
        id: roleId,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  create(body: CreateRoleBodyType, createdById: number) {
    return this.prismaService.role.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  async update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateRoleBodyType;
    id: RoleType['id'];
    updatedById: number;
  }): Promise<RoleType> {
    if (body.permissionIds.length > 0) {
      const permissions = await this.prismaService.permission.findMany({
        where: {
          id: {
            in: body.permissionIds,
          },
        },
      });

      const deletedPermissions = permissions.filter((permission) => permission.deletedAt);
      if (deletedPermissions.length > 0) {
        const deletedIds = deletedPermissions.map((permission) => permission.id).join(', ');
        throw new Error(`Permission with id has been deleted: ${deletedIds}`);
      }
    }

    return this.prismaService.role.update({
      data: {
        name: body.name,
        description: body.description,
        isActive: body.isActive,
        permissions: {
          set: body.permissionIds.map((id) => ({ id })),
        },
        updatedById,
      },
      where: {
        id,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  delete(
    {
      roleId,
      deletedById,
    }: {
      roleId: RoleType['id'];
      deletedById: number;
    },
    isHard?: boolean,
  ): Promise<RoleType> {
    return isHard
      ? this.prismaService.role.delete({
          where: {
            id: roleId,
          },
        })
      : this.prismaService.role.update({
          data: {
            deletedById,
            deletedAt: new Date(),
          },
          where: {
            id: roleId,
            deletedAt: null,
          },
        });
  }
}
