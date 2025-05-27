import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateProductTranslationBodyDTO,
  CreateProductTranslationResDTO,
  GetProductTranslationDetailResDTO,
  GetProductTranslationParamsDTO,
  GetProductTranslationsResDTO,
  UpdateProductTranslationBodyDTO,
  UpdateProductTranslationResDTO,
} from 'src/routes/product/product-translation/product-translation.dto';
import { ProductTranslationService } from 'src/routes/product/product-translation/product-translation.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('product-translations')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  @Get()
  @ZodSerializerDto(GetProductTranslationsResDTO)
  list(@Param() pagination: PaginationQueryDTO) {
    return this.productTranslationService.list(pagination);
  }

  @Get(':productTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDTO)
  findById(@Param() params: GetProductTranslationParamsDTO) {
    return this.productTranslationService.findById(params.productTranslationId);
  }

  @Post()
  @ZodSerializerDto(CreateProductTranslationResDTO)
  create(@Body() body: CreateProductTranslationBodyDTO, @ActiveUser('userId') createdById: UserType['id']) {
    return this.productTranslationService.create(body, createdById);
  }

  @Put(':productTranslationId')
  @ZodSerializerDto(UpdateProductTranslationResDTO)
  update(
    @Body() body: UpdateProductTranslationBodyDTO,
    @Param() params: GetProductTranslationParamsDTO,
    @ActiveUser('userId') updatedById: UserType['id'],
  ) {
    return this.productTranslationService.update({ body, id: params.productTranslationId, updatedById });
  }

  @Delete(':productTranslationId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetProductTranslationParamsDTO, @ActiveUser('userId') deletedById: UserType['id']) {
    return this.productTranslationService.delete(params.productTranslationId, deletedById);
  }
}
