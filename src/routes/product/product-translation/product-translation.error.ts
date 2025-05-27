import { UnprocessableEntityException } from '@nestjs/common';

export const ProductTranslationAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.ProductTranslationAlreadyExists',
    path: 'productId',
  },
  {
    message: 'Error.ProductTranslationAlreadyExists',
    path: 'languageId',
  },
]);

export const ProductOrLanguageNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.ProductOrLanguageNotFound',
    path: 'productId',
  },
  {
    message: 'Error.ProductOrLanguageNotFound',
    path: 'languageId',
  },
]);
