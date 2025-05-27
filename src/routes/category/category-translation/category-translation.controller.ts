import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateCategoryTranslationBodyDTO,
  CreateCategoryTranslationResDTO,
  GetCategoryTranslationDetailResDTO,
  GetCategoryTranslationParamsDTO,
  GetCategoryTranslationsResDTO,
  UpdateCategoryTranslationBodyDTO,
  UpdateCategoryTranslationResDTO,
} from 'src/routes/category/category-translation/category-translation.dto';
import { CategoryTranslationService } from 'src/routes/category/category-translation/category-translation.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('category-translations')
export class CategoryTranslationController {
  constructor(private readonly categoryTranslationService: CategoryTranslationService) {}

  @Get()
  @ZodSerializerDto(GetCategoryTranslationsResDTO)
  list(@Param() pagination: PaginationQueryDTO) {
    return this.categoryTranslationService.list(pagination);
  }

  @Get(':categoryTranslationId')
  @ZodSerializerDto(GetCategoryTranslationDetailResDTO)
  findById(@Param() params: GetCategoryTranslationParamsDTO) {
    return this.categoryTranslationService.findById(params.categoryTranslationId);
  }

  @Post()
  @ZodSerializerDto(CreateCategoryTranslationResDTO)
  create(@Body() body: CreateCategoryTranslationBodyDTO, @ActiveUser('userId') createdById: UserType['id']) {
    return this.categoryTranslationService.create(body, createdById);
  }

  @Put(':categoryTranslationId')
  @ZodSerializerDto(UpdateCategoryTranslationResDTO)
  update(
    @Body() body: UpdateCategoryTranslationBodyDTO,
    @Param() params: GetCategoryTranslationParamsDTO,
    @ActiveUser('userId') updatedById: UserType['id'],
  ) {
    return this.categoryTranslationService.update({ body, id: params.categoryTranslationId, updatedById });
  }

  @Delete(':categoryTranslationId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetCategoryTranslationParamsDTO, @ActiveUser('userId') deletedById: UserType['id']) {
    return this.categoryTranslationService.delete(params.categoryTranslationId, deletedById);
  }
}
