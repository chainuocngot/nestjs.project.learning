import { Injectable } from '@nestjs/common';
import { LanguageAlreadyExistsException } from 'src/routes/language/language.error';
import { CreateLanguageBodyType, UpdateLanguageBodyType } from 'src/routes/language/language.model';
import { LanguageRepository } from 'src/routes/language/language.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstrainPrismaError } from 'src/shared/helpers';
import { LanguageType } from 'src/shared/models/shared-language.model';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async list() {
    const data = await this.languageRepository.list();

    return {
      data,
      totalItems: data.length,
    };
  }

  async findById(languageId: LanguageType['id']) {
    const language = await this.languageRepository.findById(languageId);

    if (!language) {
      throw NotFoundRecordException;
    }

    return language;
  }

  async create(body: CreateLanguageBodyType, createdById: number) {
    try {
      return await this.languageRepository.create(body, createdById);
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw LanguageAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({ body, id, updatedById }: { body: UpdateLanguageBodyType; id: string; updatedById: number }) {
    try {
      const language = await this.languageRepository.update({ body, id, updatedById });

      return language;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async delete(languageId: LanguageType['id']) {
    try {
      await this.languageRepository.delete(languageId, false);

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
