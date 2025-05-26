import { createZodDto } from 'nestjs-zod';
import {
  CreateCategoryTranslationBodySchema,
  CreateCategoryTranslationResSchema,
  GetCategoryTranslationDetailResSchema,
  GetCategoryTranslationParamsSchema,
  GetCategoryTranslationsSchema,
  UpdateCategoryTranslationBodySchema,
  UpdateCategoryTranslationResSchema,
} from 'src/routes/category/category-translation/category-translation.model';
import { CategoryTranslationSchema } from 'src/shared/models/shared-category-translation';

export class CategoryTranslationDTO extends createZodDto(CategoryTranslationSchema) {}

export class GetCategoryTranslationsDTO extends createZodDto(GetCategoryTranslationsSchema) {}

export class GetCategoryTranslationParamsDTO extends createZodDto(GetCategoryTranslationParamsSchema) {}

export class GetCategoryTranslationDetailResDTO extends createZodDto(GetCategoryTranslationDetailResSchema) {}

export class CreateCategoryTranslationBodyDTO extends createZodDto(CreateCategoryTranslationBodySchema) {}

export class CreateCategoryTranslationResDTO extends createZodDto(CreateCategoryTranslationResSchema) {}

export class UpdateCategoryTranslationBodyDTO extends createZodDto(UpdateCategoryTranslationBodySchema) {}

export class UpdateCategoryTranslationResDTO extends createZodDto(UpdateCategoryTranslationResSchema) {}
