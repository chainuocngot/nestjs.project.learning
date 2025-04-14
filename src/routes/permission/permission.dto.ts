import { createZodDto } from 'nestjs-zod';
import {
  CreatePermissionBodySchema,
  CreatePermissionResSchema,
  GetPermissionDetailResSchema,
  GetPermissionParamsSchema,
  GetPermissionsResSchema,
  UpdatePermissionBodySchema,
  UpdatePermissionResSchema,
} from 'src/routes/permission/permission.model';

export class GetPermissionsResDTO extends createZodDto(GetPermissionsResSchema) {}

export class GetPermissionParamsDTO extends createZodDto(GetPermissionParamsSchema) {}

export class GetPermissionDetailResDTO extends createZodDto(GetPermissionDetailResSchema) {}

export class CreatePermissionBodyDTO extends createZodDto(CreatePermissionBodySchema) {}

export class CreatePermissionResDTO extends createZodDto(CreatePermissionResSchema) {}

export class UpdatePermissionBodyDTO extends createZodDto(UpdatePermissionBodySchema) {}

export class UpdatePermissionResDTO extends createZodDto(UpdatePermissionResSchema) {}
