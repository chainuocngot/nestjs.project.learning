import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod';

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  name: true,
  password: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
    code: z.string().length(6),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Error.ConfirmPasswordNotMatch',
        path: ['confirmPassword'],
      });
    }
  });

export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string(),
  type: z.nativeEnum(TypeOfVerificationCode),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const SendOTPBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict();

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
})
  .extend({
    totpCode: z.string().length(6).optional(), //2FA code
    code: z.string().length(6).optional(), //Email OTP code
  })
  .strict()
  .superRefine(({ totpCode, code }, ctx) => {
    if (totpCode !== undefined && code !== undefined) {
      const message = 'You must provide 2FA code or OTP code. Can not provide both';
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['totpCode'],
      });
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['code'],
      });
    }
  });

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export const RefreshTokenResSchema = LoginResSchema;

export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createdAt: z.date(),
  isActive: z.boolean(),
});

export const LogoutBodySchema = RefreshTokenBodySchema;

export const GoogleAuthStateSchema = DeviceSchema.pick({
  userAgent: true,
  ip: true,
});

export const GetAuthorizationUrlResSchema = z.object({
  url: z.string(),
});

export const ForgotPasswordBodySchema = z
  .object({
    email: z.string().email(),
    code: z.string().length(6),
    newPassword: z.string().min(6).max(100),
    confirmNewPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Error.ConfirmPasswordNotMatch',
        path: ['confirmNewPassword'],
      });
    }
  });

export const Disable2FABodySchema = z
  .object({
    totpCode: z.string().length(6).optional(),
    code: z.string().length(6).optional(),
  })
  .strict()
  .superRefine(({ totpCode, code }, ctx) => {
    if ((totpCode !== undefined) === (code !== undefined)) {
      const message = 'You must provide 2FA code or OTP code. Can not provide both';
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['totpCode'],
      });
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['code'],
      });
    }
  });

export const Setup2FAResSchema = z.object({
  secret: z.string(),
  uri: z.string(),
});

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;
export type RegisterResType = z.infer<typeof RegisterResSchema>;
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;
export type LoginBodyType = z.infer<typeof LoginBodySchema>;
export type LoginResType = z.infer<typeof LoginResSchema>;
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>;
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;
export type RefreshTokenResType = z.infer<typeof RefreshTokenResSchema>;
export type DeviceType = z.infer<typeof DeviceSchema>;
export type LogoutBodyType = z.infer<typeof LogoutBodySchema>;
export type GoogleAuthStateType = z.infer<typeof GoogleAuthStateSchema>;
export type GetAuthorizationUrlResType = z.infer<typeof GetAuthorizationUrlResSchema>;
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>;
export type Disable2FABodyType = z.infer<typeof Disable2FABodySchema>;
export type Setup2FAResType = z.infer<typeof Setup2FAResSchema>;
