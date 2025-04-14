import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common';

export const RoleAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.RoleAlreadyExists',
    path: 'id',
  },
]);

export const ProhibitedActionOnBasedRoleException = new ForbiddenException('Error.ProhibitedActionOnBasedRole');
