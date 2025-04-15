import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  CannotUpdateOrDeleteYourselfException,
  RoleNotFoundException,
  UserAlreadyExistsException,
} from 'src/routes/user/user.error';
import { CreateUserBodyType, UpdateUserBodyType } from 'src/routes/user/user.model';
import { UserRepository } from 'src/routes/user/user.repo';
import { RoleName } from 'src/shared/constants/role.constant';
import { NotFoundRecordException } from 'src/shared/error';
import {
  isForeignKeyConstrainPrismaError,
  isNotFoundPrismaError,
  isUniqueConstrainPrismaError,
} from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { RoleType } from 'src/shared/models/shared-role.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { HashingService } from 'src/shared/services/hashing.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly sharedRoleRepository: SharedRoleRepository,
  ) {}

  private async verifyRole({ roleNameAgent, roleIdTarget }) {
    if (roleNameAgent === RoleName.Admin) {
      return true;
    } else {
      const adminRoleId = await this.sharedRoleRepository.getAdminRoleId();
      if (roleIdTarget === adminRoleId) {
        throw new ForbiddenException();
      }
      return true;
    }
  }

  private async getRoleIdByUserId(userId: UserType['id']) {
    const user = await this.sharedUserRepository.findUnique({
      id: userId,
    });

    if (!user) {
      throw NotFoundRecordException;
    }

    return user.roleId;
  }

  private verifyYourself({ userAgentId, userTargetId }: { userAgentId: UserType['id']; userTargetId: UserType['id'] }) {
    if (userAgentId === userTargetId) {
      throw CannotUpdateOrDeleteYourselfException;
    }
  }

  findAll(pagination: PaginationQueryType) {
    return this.userRepository.findAll(pagination);
  }

  async findById(userId: UserType['id']) {
    const user = await this.sharedUserRepository.findUniqueIncludeRolePermissions({
      id: userId,
    });

    if (!user) {
      throw NotFoundRecordException;
    }

    return user;
  }

  async create({
    body,
    createdById,
    createdByRoleName,
  }: {
    body: CreateUserBodyType;
    createdById: UserType['id'];
    createdByRoleName: RoleType['name'];
  }) {
    try {
      await this.verifyRole({
        roleNameAgent: createdByRoleName,
        roleIdTarget: body.roleId,
      });

      const hashedPassword = await this.hashingService.hash(body.password);

      return await this.userRepository.create({ ...body, password: hashedPassword }, createdById);
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw UserAlreadyExistsException;
      }
      if (isForeignKeyConstrainPrismaError(error)) {
        throw RoleNotFoundException;
      }

      throw error;
    }
  }

  async update({
    body,
    id,
    updatedById,
    updatedByRoleName,
  }: {
    body: UpdateUserBodyType;
    id: UserType['id'];
    updatedById: UserType['id'];
    updatedByRoleName: RoleType['name'];
  }) {
    try {
      this.verifyYourself({
        userAgentId: updatedById,
        userTargetId: id,
      });

      const roleIdTarget = await this.getRoleIdByUserId(id);

      await this.verifyRole({
        roleNameAgent: updatedByRoleName,
        roleIdTarget,
      });

      const updatedUser = await this.sharedUserRepository.update(
        {
          id,
        },
        {
          ...body,
          updatedById,
          updatedAt: new Date(),
        },
      );

      return updatedUser;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstrainPrismaError(error)) {
        throw UserAlreadyExistsException;
      }
      if (isForeignKeyConstrainPrismaError(error)) {
        throw RoleNotFoundException;
      }

      throw error;
    }
  }

  async delete({
    id,
    deletedById,
    deletedByRoleName,
  }: {
    id: UserType['id'];
    deletedById: UserType['id'];
    deletedByRoleName: RoleType['name'];
  }) {
    try {
      this.verifyYourself({
        userAgentId: deletedById,
        userTargetId: id,
      });

      const roleIdTarget = await this.getRoleIdByUserId(id);

      await this.verifyRole({
        roleNameAgent: deletedByRoleName,
        roleIdTarget,
      });

      await this.userRepository.delete({
        id,
        deletedById,
      });

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
