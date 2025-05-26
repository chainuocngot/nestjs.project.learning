import { createZodDto } from 'nestjs-zod';
import {
  CategorySchema,
  CategoryWithTranslationSchema,
  CreateCategoryBodySchema,
  CreateCategoryResSchema,
  GetCategoriesParamsSchema,
  GetCategoriesResSchema,
  GetCategoryDetailResSchema,
  GetCategoryParamsSchema,
  UpdateCategoryBodySchema,
  UpdateCategoryResSchema,
} from 'src/routes/category/category.model';

export class CategoryDTO extends createZodDto(CategorySchema) {}

export class CategoryWithTranslationDTO extends createZodDto(CategoryWithTranslationSchema) {}

export class GetCategoriesParamsDTO extends createZodDto(GetCategoriesParamsSchema) {}

export class GetCategoriesResDTO extends createZodDto(GetCategoriesResSchema) {}

export class GetCategoryParamsDTO extends createZodDto(GetCategoryParamsSchema) {}

export class GetCategoryDetailResDTO extends createZodDto(GetCategoryDetailResSchema) {}

export class CreateCategoryBodyDTO extends createZodDto(CreateCategoryBodySchema) {}

export class CreateCategoryResDTO extends createZodDto(CreateCategoryResSchema) {}

export class UpdateCategoryBodyDTO extends createZodDto(UpdateCategoryBodySchema) {}

export class UpdateCategoryResDTO extends createZodDto(UpdateCategoryResSchema) {}
