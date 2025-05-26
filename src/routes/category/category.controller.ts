import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateCategoryBodyDTO,
  CreateCategoryResDTO,
  GetCategoriesParamsDTO,
  GetCategoriesResDTO,
  GetCategoryDetailResDTO,
  GetCategoryParamsDTO,
  UpdateCategoryBodyDTO,
  UpdateCategoryResDTO,
} from 'src/routes/category/category.dto';
import { CategoryService } from 'src/routes/category/category.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetCategoriesResDTO)
  findAll(@Param() params: GetCategoriesParamsDTO) {
    return this.categoryService.findAll(params);
  }

  @Get(':categoryId')
  @IsPublic()
  @ZodSerializerDto(GetCategoryDetailResDTO)
  findById(@Param() params: GetCategoryParamsDTO) {
    return this.categoryService.findById(params.categoryId);
  }

  @Post()
  @ZodSerializerDto(CreateCategoryResDTO)
  create(@Body() body: CreateCategoryBodyDTO, @ActiveUser('userId') createdById: UserType['id']) {
    return this.categoryService.create(body, createdById);
  }

  @Put(':categoryId')
  @ZodSerializerDto(UpdateCategoryResDTO)
  update(
    @Body() body: UpdateCategoryBodyDTO,
    @Param() params: GetCategoryParamsDTO,
    @ActiveUser('userId') updatedById: UserType['id'],
  ) {
    return this.categoryService.update({ body, id: params.categoryId, updatedById });
  }

  @Delete(':categoryId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetCategoryParamsDTO, @ActiveUser('userId') deletedById: UserType['id']) {
    return this.categoryService.delete(params.categoryId, deletedById);
  }
}
