import { createZodDto } from 'nestjs-zod';
import {
  CreateUserBodySchema,
  CreateUserResSchema,
  GetUserDetailSchema,
  GetUserParamsSchema,
  GetUsersResSchema,
  UpdateUserBodySchema,
  UpdateUserResSchema,
} from 'src/routes/user/user.model';

export class GetUsersResDTO extends createZodDto(GetUsersResSchema) {}

export class GetUserParamsDTO extends createZodDto(GetUserParamsSchema) {}

export class GetUserDetailDTO extends createZodDto(GetUserDetailSchema) {}

export class CreateUserBodyDTO extends createZodDto(CreateUserBodySchema) {}

export class CreateUserResDTO extends createZodDto(CreateUserResSchema) {}

export class UpdateUserBodyDTO extends createZodDto(UpdateUserBodySchema) {}

export class UpdateUserResDTO extends createZodDto(UpdateUserResSchema) {}
