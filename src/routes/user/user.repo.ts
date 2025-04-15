import { Injectable } from '@nestjs/common';
import { CreateUserBodyType, CreateUserResType, GetUsersResType } from 'src/routes/user/user.model';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(pagination: PaginationQueryType): Promise<GetUsersResType> {
    const skip = pagination.limit * (pagination.page - 1);
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.user.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.user.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          role: true,
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

  create(body: CreateUserBodyType, createdById: UserType['id']): Promise<CreateUserResType> {
    return this.prismaService.user.create({
      data: { ...body, createdById },
      omit: {
        password: true,
        totpSecret: true,
      },
      include: {
        role: {
          include: {
            permissions: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }

  delete(
    { id, deletedById }: { id: UserType['id']; deletedById: UserType['id'] },
    isHard?: boolean,
  ): Promise<UserType> {
    return isHard
      ? this.prismaService.user.delete({
          where: {
            id,
          },
        })
      : this.prismaService.user.update({
          data: {
            deletedById,
            deletedAt: new Date(),
          },
          where: {
            id,
            deletedAt: null,
          },
        });
  }
}
