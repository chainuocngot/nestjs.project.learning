import { Prisma } from '@prisma/client';

export const isUniqueConstrainPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
};

export const isNotFoundPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
};
