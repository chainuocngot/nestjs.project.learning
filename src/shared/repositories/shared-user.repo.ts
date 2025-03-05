import { Injectable } from '@nestjs/common';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SharedUserRepsitory {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(uniqueObject: { email: UserType['email'] } | { id: UserType['id'] }): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
    });
  }
}
