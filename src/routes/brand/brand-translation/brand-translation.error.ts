import { UnprocessableEntityException } from '@nestjs/common';

export const BrandTranslationAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.BrandTranslationAlreadyExists',
    path: 'brandId',
  },
  {
    message: 'Error.BrandTranslationAlreadyExists',
    path: 'languageId',
  },
]);

export const BrandOrLanguageNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.BrandOrLanguageNotFound',
    path: 'brandId',
  },
  {
    message: 'Error.BrandOrLanguageNotFound',
    path: 'languageId',
  },
]);
