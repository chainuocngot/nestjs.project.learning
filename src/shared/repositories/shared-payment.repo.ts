import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/shared/constants/order.constant';
import { PaymentStatus } from 'src/shared/constants/payment.constant';
import { PaymentTransactionType } from 'src/shared/models/shared-payment.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SharedPaymentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async cancelPaymentAndOrder(paymentId: PaymentTransactionType['id']) {
    const payment = await this.prismaService.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!payment) {
      throw Error('Payment not found');
    }

    const { orders } = payment;
    const productSKUSnapshots = orders.map((order) => order.items).flat();

    await this.prismaService.$transaction(async (tx) => {
      const $updateOrder = tx.order.updateMany({
        where: {
          id: {
            in: orders.map((order) => order.id),
          },
          status: OrderStatus.PendingPayment,
          deletedAt: null,
        },
        data: {
          status: OrderStatus.Cancelled,
        },
      });

      const $updateSku = Promise.all(
        productSKUSnapshots
          .filter((item) => item.skuId)
          .map((item) =>
            tx.sKU.update({
              where: {
                id: item.skuId as number,
              },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            }),
          ),
      );

      const $updatePayment = tx.payment.update({
        where: {
          id: paymentId,
          status: PaymentStatus.Pending,
        },
        data: {
          status: PaymentStatus.Fail,
        },
      });

      return await Promise.all([$updateOrder, $updateSku, $updatePayment]);
    });
  }
}
