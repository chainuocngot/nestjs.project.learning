import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PAYMENT_QUEUE_NAME } from 'src/shared/constants/queue.constant';
import { generateCancelPaymentJobId } from 'src/shared/helpers';
import { PaymentTransactionType } from 'src/shared/models/shared-payment.model';

@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue) {}

  removeJob(paymentId: PaymentTransactionType['id']) {
    return this.paymentQueue.remove(generateCancelPaymentJobId(paymentId));
  }
}
