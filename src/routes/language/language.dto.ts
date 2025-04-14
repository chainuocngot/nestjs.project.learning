import { createZodDto } from 'nestjs-zod';
import {
  CreateLanguageBodySchema,
  CreateLanguageResSchema,
  GetLanguageDetailResSchema,
  GetLanguageParamsSchema,
  GetLanguagesResSchema,
  UpdateLanguageBodySchema,
  UpdateLanguageResSchema,
} from 'src/routes/language/language.model';

export class GetLanguagesResDTO extends createZodDto(GetLanguagesResSchema) {}

export class GetLanguageParamsDTO extends createZodDto(GetLanguageParamsSchema) {}

export class GetLanguageDetailResDTO extends createZodDto(GetLanguageDetailResSchema) {}

export class CreateLanguageBodyDTO extends createZodDto(CreateLanguageBodySchema) {}

export class CreateLanguageResDTO extends createZodDto(CreateLanguageResSchema) {}

export class UpdateLanguageBodyDTO extends createZodDto(UpdateLanguageBodySchema) {}

export class UpdateLanguageResDTO extends createZodDto(UpdateLanguageResSchema) {}
