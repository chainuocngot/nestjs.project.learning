import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CANCEL_PAYMENT_JOB_NAME, PAYMENT_QUEUE_NAME } from 'src/shared/constants/queue.constant';
import { generateCancelPaymentJobId } from 'src/shared/helpers';
import { PaymentTransactionType } from 'src/shared/models/shared-payment.model';

@Injectable()
export class OrderProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue) {}

  async addCancelPaymentJob(paymentId: PaymentTransactionType['id']) {
    return this.paymentQueue.add(
      CANCEL_PAYMENT_JOB_NAME,
      {
        paymentId,
      },
      {
        delay: 24 * 60 * 60 * 1000,
        jobId: generateCancelPaymentJobId(paymentId),
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
