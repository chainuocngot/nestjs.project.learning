export const REQUEST_USER_KEY = 'user';
export const REQUEST_ROLE_PERMISSIONS = 'role_permissions';

export const AuthType = {
  Bearer: 'Bearer',
  None: 'None',
  PaymentApiKey: 'PaymentApiKey',
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

export const HTTPMethod = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE',
  Patch: 'PATCH',
  Options: 'OPTIONS',
  Head: 'HEAD',
} as const;

export type TypeOfVerificationCodeType = (typeof TypeOfVerificationCode)[keyof typeof TypeOfVerificationCode];
