import { PermissionSchema } from 'src/shared/models/shared-permission.model';
import { z } from 'zod';

export const GetPermissionsResSchema = z.object({
  data: z.array(PermissionSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetPermissionParamsSchema = z
  .object({
    permissionId: z.coerce.number(),
  })
  .strict();

export const GetPermissionDetailResSchema = PermissionSchema;

export const CreatePermissionBodySchema = PermissionSchema.pick({
  name: true,
  path: true,
  method: true,
  module: true,
}).strict();

export const CreatePermissionResSchema = PermissionSchema;

export const UpdatePermissionBodySchema = CreatePermissionBodySchema;

export const UpdatePermissionResSchema = PermissionSchema;

export type GetPermissionsResType = z.infer<typeof GetPermissionsResSchema>;
export type GetPermissionParamsType = z.infer<typeof GetPermissionParamsSchema>;
export type GetPermissionDetailResType = z.infer<typeof GetPermissionDetailResSchema>;
export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>;
export type CreatePermissionResType = z.infer<typeof CreatePermissionResSchema>;
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>;
export type UpdatePermissionResType = z.infer<typeof UpdatePermissionResSchema>;
