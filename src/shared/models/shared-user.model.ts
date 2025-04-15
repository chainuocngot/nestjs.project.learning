import { UserStatus } from 'src/shared/constants/auth.constant';
import { PermissionSchema } from 'src/shared/models/shared-permission.model';
import { RoleSchema } from 'src/shared/models/shared-role.model';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
  phoneNumber: z.string().max(15),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.nativeEnum(UserStatus),
  roleId: z.number().positive(),
  deletedById: z.number().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetProfileResSchema = UserSchema.omit({
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

export const UpdateProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export type UserType = z.infer<typeof UserSchema>;
export type GetProfileResType = z.infer<typeof GetProfileResSchema>;
export type UpdateProfileResType = z.infer<typeof UpdateProfileResSchema>;
