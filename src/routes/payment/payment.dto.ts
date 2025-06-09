import { createZodDto } from 'nestjs-zod';
import { WebhookPaymentBodySchema } from 'src/routes/payment/payment.model';
import { PaymentTransactionSchema } from 'src/shared/models/shared-payment.model';

export class PaymentTransactionDTO extends createZodDto(PaymentTransactionSchema) {}

export class WebhookPaymentBodyDTO extends createZodDto(WebhookPaymentBodySchema) {}
