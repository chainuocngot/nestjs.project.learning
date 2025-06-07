import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'date-fns';
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model';
import { OrderStatus } from 'src/shared/constants/order.constant';
import { PREFIX_PAYMENT_CODE } from 'src/shared/constants/other.constant';
import { PaymentStatus } from 'src/shared/constants/payment.constant';
import { MessageResType } from 'src/shared/models/response.model';
import { OrderWithProductSKUSnapshotType } from 'src/shared/models/shared-order.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async receiver(body: WebhookPaymentBodyType): Promise<MessageResType> {
    let amountIn = 0;
    let amountOut = 0;

    if (body.transferType === 'in') {
      amountIn = body.transferAmount;
    } else if (body.transferType === 'out') {
      amountOut = body.transferAmount;
    }

    await this.prismaService.paymentTransaction.create({
      data: {
        gateway: body.gateway,
        transactionDate: parse(body.transactionDate, 'yyyy-MM-dd HH:mm:ss', new Date()),
        accountNumber: body.accountNumber,
        subAccount: body.subAccount,
        amountIn,
        amountOut,
        accumulated: body.accumulated,
        code: body.code,
        transactionContent: body.content,
        referenceNumber: body.referenceCode,
        body: body.description,
      },
    });

    const paymentId = body.code
      ? Number(body.code.split(PREFIX_PAYMENT_CODE)[1])
      : Number(body.content?.split(PREFIX_PAYMENT_CODE)[1]);

    if (isNaN(paymentId)) {
      throw new BadRequestException('Cannot get payment id from content');
    }

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
      throw new BadRequestException(`Cannot find payment with id ${paymentId}`);
    }

    const { orders } = payment;
    const totalPrice = this.getTotalPrice(orders);

    if (totalPrice !== body.transferAmount) {
      throw new BadRequestException(`Price not match, expected ${totalPrice} but got ${body.transferAmount}`);
    }

    await this.prismaService.$transaction([
      this.prismaService.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: PaymentStatus.Success,
        },
      }),
      this.prismaService.order.updateMany({
        where: {
          id: {
            in: orders.map((order) => order.id),
          },
        },
        data: {
          status: OrderStatus.PendingPickup,
        },
      }),
    ]);

    return {
      message: 'Payment successfully',
    };
  }

  private getTotalPrice(orders: OrderWithProductSKUSnapshotType[]): number {
    return orders.reduce((total, order) => {
      const orderTotal = order.items.reduce((totalPrice, productSku) => {
        return totalPrice + productSku.skuPrice + productSku.quantity;
      }, 0);

      return total + orderTotal;
    }, 0);
  }
}
