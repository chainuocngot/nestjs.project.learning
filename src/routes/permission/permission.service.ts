import { Injectable } from '@nestjs/common';
import { PermissionAlreadyExistsException } from 'src/routes/permission/permission.error';
import {
  CreatePermissionBodyType,
  PermissionType,
  UpdatePermissionBodyType,
} from 'src/routes/permission/permission.model';
import { PermissionRepository } from 'src/routes/permission/permission.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstrainPrismaError } from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  findAll(pagination: PaginationQueryType) {
    return this.permissionRepository.findAll(pagination);
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
      return await this.permissionRepository.create(body, createdById);
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
      return await this.permissionRepository.delete({ permissionId, deletedById, isHard: true });
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      return error;
    }
  }
}
