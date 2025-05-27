import { Injectable } from '@nestjs/common';
import { PermissionAlreadyExistsException } from 'src/routes/permission/permission.error';
import { CreatePermissionBodyType, UpdatePermissionBodyType } from 'src/routes/permission/permission.model';
import { PermissionRepository } from 'src/routes/permission/permission.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstrainPrismaError } from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { PermissionType } from 'src/shared/models/shared-permission.model';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  list(pagination: PaginationQueryType) {
    return this.permissionRepository.list(pagination);
  }

  async findById(permissionId: PermissionType['id']) {
    const permission = await this.permissionRepository.findById(permissionId);

    if (!permission) {
      throw NotFoundRecordException;
    }

    return permission;
  }

  async create(body: CreatePermissionBodyType, createdById: number) {
    try {
      const permission = await this.permissionRepository.create(body, createdById);

      return permission;
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw PermissionAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({
    body,
    id,
    updatedById,
  }: {
    body: UpdatePermissionBodyType;
    id: PermissionType['id'];
    updatedById: number;
  }) {
    try {
      const permission = await this.permissionRepository.update({
        body,
        id,
        updatedById,
      });

      return permission;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstrainPrismaError(error)) {
        throw PermissionAlreadyExistsException;
      }

      return error;
    }
  }

  async delete(permissionId: PermissionType['id'], deletedById: number) {
    try {
      await this.permissionRepository.delete({ permissionId, deletedById }, false);

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
