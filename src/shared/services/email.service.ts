import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from 'src/shared/config';
import path from 'path';

const otpTemplate = fs.readFileSync(path.resolve('src/shared/email-templates/otp.html'), 'utf8');

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }

  sendOTP(payload: { email: string; code: string }) {
    const subject = 'OTP Code';
    return this.resend.emails.send({
      from: 'Chainuocngot Ecommerce <no-reply@chainuocngot.io.vn>',
      to: [payload.email],
      subject: 'OTP code',
      html: otpTemplate.replace('{{subject}}', subject).replace('{{code}}', payload.code),
    });
  }
}
