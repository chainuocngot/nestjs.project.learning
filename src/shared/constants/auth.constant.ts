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
