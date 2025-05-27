import { UnprocessableEntityException } from '@nestjs/common';

export const CategoryNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.CategoryNotFound',
    path: 'categories',
  },
]);

export const BrandNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.BrandNotFound',
    path: 'brandId',
  },
]);
