import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreatePermissionBodyDTO,
  CreatePermissionResDTO,
  GetPermissionDetailResDTO,
  GetPermissionParamsDTO,
  GetPermissionsResDTO,
  UpdatePermissionBodyDTO,
  UpdatePermissionResDTO,
} from 'src/routes/permission/permission.dto';
import { PermissionService } from 'src/routes/permission/permission.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodSerializerDto(GetPermissionsResDTO)
  list(@Query() pagination: PaginationQueryDTO) {
    return this.permissionService.list(pagination);
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDTO)
  findById(@Param() params: GetPermissionParamsDTO) {
    return this.permissionService.findById(params.permissionId);
  }

  @Post()
  @ZodSerializerDto(CreatePermissionResDTO)
  create(@Body() body: CreatePermissionBodyDTO, @ActiveUser('userId') createdById: number) {
    return this.permissionService.create(body, createdById);
  }

  @Put(':permissionId')
  @ZodSerializerDto(UpdatePermissionResDTO)
  update(
    @Body() body: UpdatePermissionBodyDTO,
    @Param() params: GetPermissionParamsDTO,
    @ActiveUser('userId') updatedById: number,
  ) {
    return this.permissionService.update({
      body,
      id: params.permissionId,
      updatedById,
    });
  }

  @Delete(':permissionId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetPermissionParamsDTO, @ActiveUser('userId') deletedById: number) {
    return this.permissionService.delete(params.permissionId, deletedById);
  }
}
