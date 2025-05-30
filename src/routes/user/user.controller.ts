import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUserDetailDTO,
  GetUserParamsDTO,
  GetUsersResDTO,
  UpdateUserBodyDTO,
  UpdateUserResDTO,
} from 'src/routes/user/user.dto';
import { UserService } from 'src/routes/user/user.service';
import { ActiveRolePermissions } from 'src/shared/decorators/active-role-permissions.decorator';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { RoleType } from 'src/shared/models/shared-role.model';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetUsersResDTO)
  list(@Query() pagination: PaginationQueryDTO) {
    return this.userService.list(pagination);
  }

  @Get(':userId')
  @ZodSerializerDto(GetUserDetailDTO)
  findById(@Param() params: GetUserParamsDTO) {
    return this.userService.findById(params.userId);
  }

  @Post()
  @ZodSerializerDto(CreateUserResDTO)
  create(
    @Body() body: CreateUserBodyDTO,
    @ActiveUser('userId') createdById: UserType['id'],
    @ActiveRolePermissions('name') createdByRoleName: RoleType['name'],
  ) {
    return this.userService.create({ body, createdById, createdByRoleName });
  }

  @Put(':userId')
  @ZodSerializerDto(UpdateUserResDTO)
  update(
    @Body() body: UpdateUserBodyDTO,
    @Param() params: GetUserParamsDTO,
    @ActiveUser('userId') updatedById: UserType['id'],
    @ActiveRolePermissions('name') updatedByRoleName: RoleType['name'],
  ) {
    return this.userService.update({
      body,
      id: params.userId,
      updatedById,
      updatedByRoleName,
    });
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() params: GetUserParamsDTO,
    @ActiveUser('userId') deletedById: UserType['id'],
    @ActiveRolePermissions('name') deletedByRoleName: RoleType['name'],
  ) {
    return this.userService.delete({ id: params.userId, deletedById, deletedByRoleName });
  }
}
