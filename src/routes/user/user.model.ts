import { PermissionSchema } from 'src/shared/models/shared-permission.model';
import { RoleSchema } from 'src/shared/models/shared-role.model';
import { UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod';

export const GetUsersResSchema = z.object({
  data: z.array(
    UserSchema.extend({
      role: RoleSchema.pick({
        id: true,
        name: true,
      }),
    }).omit({
      password: true,
      totpSecret: true,
    }),
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetUserParamsSchema = z
  .object({
    userId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetUserDetailSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleSchema.pick({
    id: true,
    name: true,
  }).extend({
    permissions: z.array(
      PermissionSchema.pick({
        id: true,
        name: true,
        module: true,
        path: true,
        method: true,
      }),
    ),
  }),
});

export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  avatar: true,
  status: true,
  password: true,
  roleId: true,
}).strict();

export const CreateUserResSchema = GetUserDetailSchema;

export const UpdateUserBodySchema = CreateUserBodySchema;

export const UpdateUserResSchema = CreateUserResSchema;

export type GetUsersResType = z.infer<typeof GetUsersResSchema>;
export type GetUserParamsType = z.infer<typeof GetUserParamsSchema>;
export type GetUserDetailType = z.infer<typeof GetUserDetailSchema>;
export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>;
export type CreateUserResType = z.infer<typeof CreateUserResSchema>;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>;
export type UpdateUserResType = z.infer<typeof UpdateUserResSchema>;
