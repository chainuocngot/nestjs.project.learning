import { PermissionSchema } from 'src/shared/models/shared-permission.model';
import { RoleSchema } from 'src/shared/models/shared-role.model';
import { z } from 'zod';

export const RolePermissionsSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
});

export const GetRolesResSchema = z.object({
  data: z.array(RoleSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetRoleParamsSchema = z
  .object({
    roleId: z.coerce.number(),
  })
  .strict();

export const GetRoleDetailResSchema = RolePermissionsSchema;

export const CreateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
}).strict();

export const CreateRoleResSchema = RoleSchema;

export const UpdateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
})
  .extend({
    permissionIds: z.array(z.number()),
  })
  .strict();

export const UpdateRoleResSchema = RoleSchema;

export type RoleWithPermissionsType = z.infer<typeof RolePermissionsSchema>;
export type GetRolesResType = z.infer<typeof GetRolesResSchema>;
export type GetRoleParamsType = z.infer<typeof GetRoleParamsSchema>;
export type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>;
export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>;
export type CreateRoleResType = z.infer<typeof CreateRoleResSchema>;
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>;
export type UpdateRoleResType = z.infer<typeof UpdateRoleResSchema>;
