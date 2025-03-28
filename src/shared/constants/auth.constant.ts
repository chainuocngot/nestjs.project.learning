export const REQUEST_USER_KEY = 'user';

export const AuthType = {
  Bearer: 'Bearer',
  None: 'None',
  ApiKey: 'ApiKey',
} as const;

export type AuthTypes = (typeof AuthType)[keyof typeof AuthType];

export const ConditionGuard = {
  And: 'and',
  Or: 'or',
} as const;

export type ConditionGuard = (typeof ConditionGuard)[keyof typeof ConditionGuard];

export const UserStatus = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Blocked: 'BLOCKED',
} as const;

export const TypeOfVerificationCode = {
  Register: 'REGISTER',
  ForgotPassword: 'FORGOT_PASSWORD',
  Login: 'LOGIN',
  Disabled_2FA: 'DISABLE_2FA',
} as const;

export type TypeOfVerificationCodeType = (typeof TypeOfVerificationCode)[keyof typeof TypeOfVerificationCode];
