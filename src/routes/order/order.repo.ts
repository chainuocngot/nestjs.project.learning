import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetOrdersQueryType, GetOrdersResType } from 'src/routes/order/order.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(queries: GetOrdersQueryType, userId: UserType['id']): Promise<GetOrdersResType> {
    const skip = queries.limit * (queries.page - 1);
    const take = queries.limit;

    const where: Prisma.OrderWhereInput = {
      status: queries.status,
      userId,
    };

    const [totalItems, data] = await Promise.all([
      this.prismaService.order.count({
        where,
      }),
      this.prismaService.order.findMany({
        where,
        include: {
          items: true,
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      totalItems,
      data,
      limit: queries.limit,
      page: queries.page,
      totalPages: Math.ceil(totalItems / queries.limit),
    };
  }
}
