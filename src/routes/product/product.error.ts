import { UnprocessableEntityException } from '@nestjs/common';

export const BrandOrCategoryNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.BrandOrCategoryNotFound',
    path: 'brandId',
  },
  {
    message: 'Error.BrandOrCategoryNotFound',
    path: 'categories',
  },
]);
