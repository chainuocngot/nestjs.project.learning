import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from 'src/routes/payment/payment.repo';
import { PaymentProducer } from 'src/routes/payment/payment.producer';
import { BullModule } from '@nestjs/bullmq';
import { PAYMENT_QUEUE_NAME } from 'src/shared/constants/queue.constant';

@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE_NAME,
    }),
  ],
  providers: [PaymentService, PaymentRepository, PaymentProducer],
  controllers: [PaymentController],
})
export class PaymentModule {}
