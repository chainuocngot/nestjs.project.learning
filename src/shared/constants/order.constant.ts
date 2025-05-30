export const OrderStatus = {
  PendingPayment: 'PENDING_PAYMENT',
  PendingPickup: 'PENDING_PICKUP',
  PendingDelivery: 'PENDING_DELIVERY',
  Delivered: 'DELIVERED',
  Returned: 'RETURNED',
  Cancelled: 'CANCELLED',
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
