import React from 'react';
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from 'src/shared/config';
import OTPEmail from 'emails/otp';
import { render } from '@react-email/render';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }

  async sendOTP(payload: { email: string; code: string }) {
    const subject = 'OTP Code';

    const html = await render(<OTPEmail code={payload.code} title={subject} />, {
      pretty: true,
    });

    return this.resend.emails.send({
      from: 'Chainuocngot Ecommerce <no-reply@chainuocngot.io.vn>',
      to: [payload.email],
      subject: 'OTP code',
      html,
    });
  }
}
