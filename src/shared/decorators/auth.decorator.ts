import { SetMetadata } from '@nestjs/common';
import { AuthTypes, ConditionGuard } from 'src/shared/constants/auth.constant';

export const AUTH_TYPE_KEY = 'authType';
export type AuthTypeDecoratorPayload = { authTypes: AuthTypes[]; options: { condition: ConditionGuard } };

export const Auth = (authTypes: AuthTypes[], options?: { condition: ConditionGuard }) => {
  return SetMetadata(AUTH_TYPE_KEY, {
    authTypes,
    options: options ?? {
      condition: ConditionGuard.And,
    },
  });
};
