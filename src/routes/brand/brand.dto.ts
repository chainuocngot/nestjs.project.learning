import { createZodDto } from 'nestjs-zod';
import {
  CreateBrandBodySchema,
  CreateBrandResSchema,
  GetBrandDetailResSchema,
  GetBrandParamsSchema,
  GetBrandsResSchema,
  UpdateBrandBodySchema,
  UpdateBrandResSchema,
} from 'src/routes/brand/brand.model';

export class GetBrandsResDTO extends createZodDto(GetBrandsResSchema) {}

export class GetBrandParamsDTO extends createZodDto(GetBrandParamsSchema) {}

export class GetBrandDetailResDTO extends createZodDto(GetBrandDetailResSchema) {}

export class CreateBrandBodyDTO extends createZodDto(CreateBrandBodySchema) {}

export class CreateBrandResDTO extends createZodDto(CreateBrandResSchema) {}

export class UpdateBrandBodyDTO extends createZodDto(UpdateBrandBodySchema) {}

export class UpdateBrandResDTO extends createZodDto(UpdateBrandResSchema) {}
