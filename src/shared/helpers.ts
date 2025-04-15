import { Prisma } from '@prisma/client';
import { randomInt } from 'crypto';

export const isUniqueConstrainPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
};

export const isNotFoundPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
};

export const isForeignKeyConstrainPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003';
};

export const generateOTP = () => {
  return randomInt(100000, 1000000).toString();
};
