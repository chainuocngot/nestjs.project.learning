import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ManageProductService } from 'src/routes/product/manage-product.service';
import {
  CreateProductBodyDTO,
  CreateProductResDTO,
  GetManageProductsQueryDTO,
  GetProductDetailResDTO,
  GetProductParamsDTO,
  GetProductsResDTO,
  UpdateProductBodyDTO,
  UpdateProductResDTO,
} from 'src/routes/product/product.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { UserType } from 'src/shared/models/shared-user.model';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

@Controller('manage-product/products')
export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}

  @Get()
  @ZodSerializerDto(GetProductsResDTO)
  list(@Query() queries: GetManageProductsQueryDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.list({
      queries,
      roleNameRequest: user.roleName,
      userIdRequest: user.userId,
    });
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDTO)
  getDetail(@Param() params: GetProductParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.getDetail({
      productId: params.productId,
      roleNameRequest: user.roleName,
      userIdRequest: user.userId,
    });
  }

  @Post()
  @ZodSerializerDto(CreateProductResDTO)
  create(@Body() body: CreateProductBodyDTO, @ActiveUser('userId') createdById: UserType['id']) {
    return this.manageProductService.create(body, createdById);
  }

  @Put(':productId')
  @ZodSerializerDto(UpdateProductResDTO)
  update(
    @Body() body: UpdateProductBodyDTO,
    @Param() params: GetProductParamsDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.manageProductService.update({
      body,
      productId: params.productId,
      updatedById: user.userId,
      roleNameRequest: user.roleName,
    });
  }

  @Delete(':productId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetProductParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.delete({
      deletedById: user.userId,
      productId: params.productId,
      roleNameRequest: user.roleName,
    });
  }
}
