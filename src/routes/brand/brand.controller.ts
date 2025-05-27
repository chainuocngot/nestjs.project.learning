import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateBrandBodyDTO,
  CreateBrandResDTO,
  GetBrandDetailResDTO,
  GetBrandParamsDTO,
  GetBrandsResDTO,
  UpdateBrandBodyDTO,
  UpdateBrandResDTO,
} from 'src/routes/brand/brand.dto';
import { BrandService } from 'src/routes/brand/brand.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetBrandsResDTO)
  list(@Param() pagination: PaginationQueryDTO) {
    return this.brandService.list(pagination);
  }

  @Get(':brandId')
  @IsPublic()
  @ZodSerializerDto(GetBrandDetailResDTO)
  findById(@Param() params: GetBrandParamsDTO) {
    return this.brandService.findById(params.brandId);
  }

  @Post()
  @ZodSerializerDto(CreateBrandResDTO)
  create(@Body() body: CreateBrandBodyDTO, @ActiveUser('userId') createdById: UserType['id']) {
    return this.brandService.create(body, createdById);
  }

  @Put(':brandId')
  @ZodSerializerDto(UpdateBrandResDTO)
  update(
    @Body() body: UpdateBrandBodyDTO,
    @Param() params: GetBrandParamsDTO,
    @ActiveUser('userId') updatedById: UserType['id'],
  ) {
    return this.brandService.update({ body, id: params.brandId, updatedById });
  }

  @Delete(':brandId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetBrandParamsDTO, @ActiveUser('userId') deletedById: UserType['id']) {
    return this.brandService.delete(params.brandId, deletedById);
  }
}
