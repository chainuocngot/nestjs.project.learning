import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateBrandTranslationBodyDTO,
  CreateBrandTranslationResDTO,
  GetBrandTranslationDetailResDTO,
  GetBrandTranslationParamsDTO,
  GetBrandTranslationsDTO,
  UpdateBrandTranslationBodyDTO,
  UpdateBrandTranslationResDTO,
} from 'src/routes/brand/brand-translation/brand-translation.dto';
import { BrandTranslationService } from 'src/routes/brand/brand-translation/brand-translation.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('brand-translations')
export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  @Get()
  @ZodSerializerDto(GetBrandTranslationsDTO)
  list(@Query() pagination: PaginationQueryDTO) {
    return this.brandTranslationService.list(pagination);
  }

  @Get(':brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
  findById(@Param() params: GetBrandTranslationParamsDTO) {
    return this.brandTranslationService.findById(params.brandTranslationId);
  }

  @Post()
  @ZodSerializerDto(CreateBrandTranslationResDTO)
  create(@Body() body: CreateBrandTranslationBodyDTO, @ActiveUser('userId') createdById: UserType['id']) {
    return this.brandTranslationService.create(body, createdById);
  }

  @Put(':brandTranslationId')
  @ZodSerializerDto(UpdateBrandTranslationResDTO)
  update(
    @Body() body: UpdateBrandTranslationBodyDTO,
    @Param() params: GetBrandTranslationParamsDTO,
    @ActiveUser('userId') updatedById: UserType['id'],
  ) {
    return this.brandTranslationService.update({ body, id: params.brandTranslationId, updatedById });
  }

  @Delete(':brandTranslationId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetBrandTranslationParamsDTO, @ActiveUser('userId') deletedById: UserType['id']) {
    return this.brandTranslationService.delete(params.brandTranslationId, deletedById);
  }
}
