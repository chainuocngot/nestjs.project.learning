import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateProductBodyDTO,
  CreateProductResDTO,
  GetProductDetailResDTO,
  GetProductParamsDTO,
  GetProductsQueryDTO,
  GetProductsResDTO,
  UpdateProductBodyDTO,
  UpdateProductResDTO,
} from 'src/routes/product/product.dto';
import { ProductService } from 'src/routes/product/product.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetProductsResDTO)
  list(@Query() queries: GetProductsQueryDTO) {
    return this.productService.list(queries);
  }

  @Get(':productId')
  @IsPublic()
  @ZodSerializerDto(GetProductDetailResDTO)
  findById(@Param() params: GetProductParamsDTO) {
    return this.productService.findById(params.productId);
  }

  @Post()
  @ZodSerializerDto(CreateProductResDTO)
  create(@Body() body: CreateProductBodyDTO, @ActiveUser('userId') createdById: UserType['id']) {
    return this.productService.create(body, createdById);
  }

  @Put(':productId')
  @ZodSerializerDto(UpdateProductResDTO)
  update(
    @Body() body: UpdateProductBodyDTO,
    @Param() params: GetProductParamsDTO,
    @ActiveUser('userId') updatedById: UserType['id'],
  ) {
    return this.productService.update({
      body,
      productId: params.productId,
      updatedById,
    });
  }

  @Delete(':productId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetProductParamsDTO, @ActiveUser('userId') deletedById: UserType['id']) {
    return this.productService.delete(params.productId, deletedById);
  }
}
