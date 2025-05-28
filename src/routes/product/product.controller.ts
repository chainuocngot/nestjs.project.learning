import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  GetProductDetailResDTO,
  GetProductParamsDTO,
  GetProductsQueryDTO,
  GetProductsResDTO,
} from 'src/routes/product/product.dto';
import { ProductService } from 'src/routes/product/product.service';
import { IsPublic } from 'src/shared/decorators/auth.decorator';

@Controller('products')
@IsPublic()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ZodSerializerDto(GetProductsResDTO)
  list(@Query() queries: GetProductsQueryDTO) {
    return this.productService.list(queries);
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDTO)
  getDetail(@Param() params: GetProductParamsDTO) {
    return this.productService.getDetail(params.productId);
  }
}
