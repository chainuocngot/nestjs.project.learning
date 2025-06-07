export const PaymentStatus = {
  Pending: 'PENDING',
  Success: 'SUCCESS',
  Fail: 'FAIL',
} as const;

export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];
