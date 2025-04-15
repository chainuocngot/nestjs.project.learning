import { Injectable } from '@nestjs/common';
import { ChangePasswordBodyType, UpdateMeBodyType } from 'src/routes/profile/profile.model';
import { InvalidPasswordException, NotFoundRecordException } from 'src/shared/error';
import { isUniqueConstrainPrismaError } from 'src/shared/helpers';
import { UserType } from 'src/shared/models/shared-user.model';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { HashingService } from 'src/shared/services/hashing.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async getProfile(userId: UserType['id']) {
    const user = await this.sharedUserRepository.findUniqueIncludeRolePermissions({
      id: userId,
    });

    if (!user) {
      throw NotFoundRecordException;
    }

    return user;
  }

  async updateProfile(userId: UserType['id'], body: UpdateMeBodyType) {
    try {
      return await this.sharedUserRepository.update(
        {
          id: userId,
        },
        {
          ...body,
          updatedAt: new Date(),
          updatedById: userId,
        },
      );
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async changePassword(userId: UserType['id'], body: Omit<ChangePasswordBodyType, 'confirmNewPassword'>) {
    try {
      const user = await this.sharedUserRepository.findUnique({
        id: userId,
      });

      if (!user) {
        throw NotFoundRecordException;
      }

      const isPasswordMatch = await this.hashingService.compare(body.password, user.password);

      if (!isPasswordMatch) {
        throw InvalidPasswordException;
      }

      const hashedPassword = await this.hashingService.hash(body.newPassword);

      await this.sharedUserRepository.update(
        {
          id: userId,
        },
        {
          password: hashedPassword,
          updatedAt: new Date(),
          updatedById: userId,
        },
      );

      return {
        message: 'Change password successfully',
      };
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
