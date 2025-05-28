import { createZodDto } from 'nestjs-zod';
import {
  CreateProductBodySchema,
  CreateProductResSchema,
  DeleteProductResSchema,
  GetManageProductsQuerySchema,
  GetProductDetailResSchema,
  GetProductParamsSchema,
  GetProductsQuerySchema,
  GetProductsResSchema,
  UpdateProductBodySchema,
  UpdateProductResSchema,
} from 'src/routes/product/product.model';
import { ProductSchema, VariantSchema, VariantsSchema } from 'src/shared/models/shared-product.model';

export class VariantDTO extends createZodDto(VariantSchema) {}

export class VariantsDTO extends createZodDto(VariantsSchema) {}

export class ProductDTO extends createZodDto(ProductSchema) {}

export class GetProductsQueryDTO extends createZodDto(GetProductsQuerySchema) {}

export class GetManageProductsQueryDTO extends createZodDto(GetManageProductsQuerySchema) {}

export class GetProductsResDTO extends createZodDto(GetProductsResSchema) {}

export class GetProductParamsDTO extends createZodDto(GetProductParamsSchema) {}

export class GetProductDetailResDTO extends createZodDto(GetProductDetailResSchema) {}

export class CreateProductBodyDTO extends createZodDto(CreateProductBodySchema) {}

export class CreateProductResDTO extends createZodDto(CreateProductResSchema) {}

export class UpdateProductBodyDTO extends createZodDto(UpdateProductBodySchema) {}

export class UpdateProductResDTO extends createZodDto(UpdateProductResSchema) {}

export class DeleteProductResDTO extends createZodDto(DeleteProductResSchema) {}
