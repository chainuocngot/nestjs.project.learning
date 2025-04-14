import { createZodDto } from 'nestjs-zod';
import {
  CreateRoleBodySchema,
  CreateRoleResSchema,
  GetRoleDetailResSchema,
  GetRoleParamsSchema,
  GetRolesResSchema,
  UpdateRoleBodySchema,
  UpdateRoleResSchema,
} from 'src/routes/role/role.model';
import { RoleSchema } from 'src/shared/models/shared-role.model';

export class RoleDTO extends createZodDto(RoleSchema) {}

export class GetRolesResDTO extends createZodDto(GetRolesResSchema) {}

export class GetRoleParamsDTO extends createZodDto(GetRoleParamsSchema) {}

export class GetRoleDetailResDTO extends createZodDto(GetRoleDetailResSchema) {}

export class CreateRoleBodyDTO extends createZodDto(CreateRoleBodySchema) {}

export class CreateRoleResDTO extends createZodDto(CreateRoleResSchema) {}

export class UpdateRoleBodyDTO extends createZodDto(UpdateRoleBodySchema) {}

export class UpdateRoleResDTO extends createZodDto(UpdateRoleResSchema) {}
