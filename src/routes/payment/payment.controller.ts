import { Body, Controller, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { WebhookPaymentBodyDTO } from 'src/routes/payment/payment.dto';
import { PaymentService } from 'src/routes/payment/payment.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('receiver')
  @ZodSerializerDto(MessageResDTO)
  @Auth(['PaymentApiKey'])
  receiver(@Body() body: WebhookPaymentBodyDTO) {
    return this.paymentService.receiver(body);
  }
}
