import { z } from 'zod';

export const PaymentTransactionSchema = z.object({
  id: z.number(),
  gateway: z.string().max(100),
  transactionDate: z.date(),
  accountNumber: z.string().max(100).nullable(),
  subAccount: z.string().max(250).nullable(),
  amountIn: z.number(),
  amountOut: z.number(),
  accumulated: z.number(),
  code: z.string().max(250).nullable(),
  transactionContent: z.string().nullable(),
  referenceNumber: z.string().max(255).nullable(),
  body: z.string().nullable(),

  createdAt: z.date(),
});

export type PaymentTransactionType = z.infer<typeof PaymentTransactionSchema>;
