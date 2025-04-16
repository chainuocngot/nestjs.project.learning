import { createZodDto } from 'nestjs-zod';
import {
  CreateBrandTranslationBodySchema,
  CreateBrandTranslationResSchema,
  GetBrandTranslationDetailResSchema,
  GetBrandTranslationParamsSchema,
  GetBrandTranslationsSchema,
  UpdateBrandTranslationBodySchema,
  UpdateBrandTranslationResSchema,
} from 'src/routes/brand/brand-translation/brand-translation.model';

export class GetBrandTranslationsDTO extends createZodDto(GetBrandTranslationsSchema) {}

export class GetBrandTranslationParamsDTO extends createZodDto(GetBrandTranslationParamsSchema) {}

export class GetBrandTranslationDetailResDTO extends createZodDto(GetBrandTranslationDetailResSchema) {}

export class CreateBrandTranslationBodyDTO extends createZodDto(CreateBrandTranslationBodySchema) {}

export class CreateBrandTranslationResDTO extends createZodDto(CreateBrandTranslationResSchema) {}

export class UpdateBrandTranslationBodyDTO extends createZodDto(UpdateBrandTranslationBodySchema) {}

export class UpdateBrandTranslationResDTO extends createZodDto(UpdateBrandTranslationResSchema) {}
