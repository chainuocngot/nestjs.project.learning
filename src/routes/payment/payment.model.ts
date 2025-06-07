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

export const WebhookPaymentBodySchema = z.object({
  id: z.number(),
  gateway: z.string(),
  transactionDate: z.string(),
  accountNumber: z.string().nullable(),
  code: z.string().nullable(),
  content: z.string().nullable(),
  transferType: z.enum(['in', 'out']),
  transferAmount: z.number(),
  accumulated: z.number(),
  subAccount: z.string().nullable(),
  referenceCode: z.string().nullable(),
  description: z.string(),
});

export type PaymentTransactionType = z.infer<typeof PaymentTransactionSchema>;
export type WebhookPaymentBodyType = z.infer<typeof WebhookPaymentBodySchema>;
