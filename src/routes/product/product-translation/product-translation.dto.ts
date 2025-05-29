import { createZodDto } from 'nestjs-zod';
import {
  CreateProductTranslationBodySchema,
  CreateProductTranslationResSchema,
  GetProductTranslationDetailResSchema,
  GetProductTranslationParamsSchema,
  GetProductTranslationsResSchema,
  UpdateProductTranslationBodySchema,
  UpdateProductTranslationResSchema,
} from 'src/routes/product/product-translation/product-translation.model';
import { ProductTranslationSchema } from 'src/shared/models/shared-product-translation.model';

export class ProductTranslationDTO extends createZodDto(ProductTranslationSchema) {}

export class GetProductTranslationsResDTO extends createZodDto(GetProductTranslationsResSchema) {}

export class GetProductTranslationParamsDTO extends createZodDto(GetProductTranslationParamsSchema) {}

export class GetProductTranslationDetailResDTO extends createZodDto(GetProductTranslationDetailResSchema) {}

export class CreateProductTranslationBodyDTO extends createZodDto(CreateProductTranslationBodySchema) {}

export class CreateProductTranslationResDTO extends createZodDto(CreateProductTranslationResSchema) {}

export class UpdateProductTranslationBodyDTO extends createZodDto(UpdateProductTranslationBodySchema) {}

export class UpdateProductTranslationResDTO extends createZodDto(UpdateProductTranslationResSchema) {}
