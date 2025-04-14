import { BadRequestException, Injectable } from '@nestjs/common';
import { ProhibitedActionOnBasedRoleException, RoleAlreadyExistsException } from 'src/routes/role/role.error';
import { CreateRoleBodyType, UpdateRoleBodyType } from 'src/routes/role/role.model';
import { RoleRepository } from 'src/routes/role/role.repo';
import { RoleName } from 'src/shared/constants/role.constant';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstrainPrismaError } from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { RoleType } from 'src/shared/models/shared-role.model';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  findAll(pagination: PaginationQueryType) {
    return this.roleRepository.findAll(pagination);
  }

  async findById(roleId: RoleType['id']) {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw NotFoundRecordException;
    }

    return role;
  }

  async create(body: CreateRoleBodyType, createdById: number) {
    try {
      return await this.roleRepository.create(body, createdById);
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw RoleAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({ body, id, updatedById }: { body: UpdateRoleBodyType; id: RoleType['id']; updatedById: number }) {
    try {
      const role = await this.roleRepository.findById(id);
      if (!role) {
        throw NotFoundRecordException;
      }

      if (role.name === RoleName.Admin) {
        throw ProhibitedActionOnBasedRoleException;
      }

      const updatedRole = await this.roleRepository.update({ body, id, updatedById });

      return updatedRole;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstrainPrismaError(error)) {
        throw RoleAlreadyExistsException;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  async delete(roleId: RoleType['id'], deletedById: number) {
    try {
      const role = await this.roleRepository.findById(roleId);
      if (!role) {
        throw NotFoundRecordException;
      }

      const baseRoles: string[] = [RoleName.Admin, RoleName.Client, RoleName.Seller];
      if (baseRoles.includes(role.name)) {
        throw ProhibitedActionOnBasedRoleException;
      }

      await this.roleRepository.delete(
        {
          roleId,
          deletedById,
        },
        false,
      );

      return {
        message: 'Delete successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }
}
