import { Injectable } from '@nestjs/common';
import { CreateLanguageBodyType, LanguageType, UpdateLanguageBodyType } from 'src/routes/language/language.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class LanguageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<LanguageType[]> {
    return this.prismaService.language.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  findById(languageId: LanguageType['id']): Promise<LanguageType | null> {
    return this.prismaService.language.findUnique({
      where: {
        id: languageId,
        deletedAt: null,
      },
    });
  }

  create(body: CreateLanguageBodyType, createdById: number): Promise<LanguageType> {
    return this.prismaService.language.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({
    body,
    id,
    updatedById,
  }: {
    body: UpdateLanguageBodyType;
    id: string;
    updatedById: number;
  }): Promise<LanguageType> {
    return this.prismaService.language.update({
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

  delete(languageId: LanguageType['id'], isHard?: boolean): Promise<LanguageType> {
    return isHard
      ? this.prismaService.language.delete({
          where: {
            id: languageId,
          },
        })
      : this.prismaService.language.update({
          where: {
            id: languageId,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        });
  }
}
