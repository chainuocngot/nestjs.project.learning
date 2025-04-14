import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateLanguageBodyDTO,
  CreateLanguageResDTO,
  GetLanguageDetailResDTO,
  GetLanguageParamsDTO,
  GetLanguagesResDTO,
  UpdateLanguageBodyDTO,
  UpdateLanguageResDTO,
} from 'src/routes/language/language.dto';
import { LanguageService } from 'src/routes/language/language.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ZodSerializerDto(GetLanguagesResDTO)
  findAll() {
    return this.languageService.findAll();
  }

  @Get(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDTO)
  findById(@Param() params: GetLanguageParamsDTO) {
    return this.languageService.findById(params.languageId);
  }

  @Post()
  @ZodSerializerDto(CreateLanguageResDTO)
  create(@Body() body: CreateLanguageBodyDTO, @ActiveUser('userId') createdById: number) {
    return this.languageService.create(body, createdById);
  }

  @Put(':languageId')
  @ZodSerializerDto(UpdateLanguageResDTO)
  update(
    @Body() body: UpdateLanguageBodyDTO,
    @Param() params: GetLanguageParamsDTO,
    @ActiveUser('userId') updatedById: number,
  ) {
    return this.languageService.update({
      body,
      id: params.languageId,
      updatedById,
    });
  }

  @Delete(':languageId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetLanguageParamsDTO) {
    return this.languageService.delete(params.languageId);
  }
}
