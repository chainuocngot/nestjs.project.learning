import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from 'src/shared/config';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }

  sendOTP(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'Chainuocngot Ecommerce <no-reply@chainuocngot.io.vn>',
      to: [payload.email],
      subject: 'OTP code',
      html: `<strong>${payload.code}</strong>`,
    });
  }
}
