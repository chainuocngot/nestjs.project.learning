import { Prisma } from '@prisma/client';
import { randomInt } from 'crypto';
import path from 'path';
import { PaymentTransactionType } from 'src/shared/models/shared-payment.model';
import { v4 as uuidv4 } from 'uuid';

export const isUniqueConstrainPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
};

export const isNotFoundPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
};

export const isForeignKeyConstrainPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003';
};

export const isQueryInterpretationPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2016';
};

export const generateOTP = () => {
  return randomInt(100000, 1000000).toString();
};

export const generateRandomFilename = (filename: string) => {
  const ext = path.extname(filename);
  return `${uuidv4()}${ext}`;
};

export const generateCancelPaymentJobId = (paymentId: PaymentTransactionType['id']) => {
  return `paymentId-${paymentId}`;
};
