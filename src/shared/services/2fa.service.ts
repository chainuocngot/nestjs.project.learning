import { Injectable } from '@nestjs/common';
import * as OTPAuth from 'otpauth';
import envConfig from 'src/shared/config';

@Injectable()
export class TwoFAService {
  private createTOTP(email: string, secret?: string) {
    return new OTPAuth.TOTP({
      issuer: envConfig.APP_NAME,
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      secret: secret || new OTPAuth.Secret(),
    });
  }

  generateTOTPSecret(email: string) {
    const totp = this.createTOTP(email);

    return {
      secret: totp.secret.base32,
      uri: totp.toString(),
    };
  }

  verifyTOTP({ email, secret, token }: { email: string; secret: string; token: string }): boolean {
    const totp = this.createTOTP(email, secret);

    const delta = totp.validate({
      token,
      window: 1,
    });

    return delta !== null;
  }
}
