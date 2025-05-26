import { UnprocessableEntityException } from '@nestjs/common';

export const CategoryTranslationAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.CategoryTranslationAlreadyExists',
    path: 'categoryId',
  },
  {
    message: 'Error.CategoryTranslationAlreadyExists',
    path: 'languageId',
  },
]);

export const CategoryOrLanguageNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.CategoryOrLanguageNotFound',
    path: 'categoryId',
  },
  {
    message: 'Error.CategoryOrLanguageNotFound',
    path: 'languageId',
  },
]);
