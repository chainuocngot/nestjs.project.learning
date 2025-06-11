import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import envConfig from 'src/shared/config';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class PaymentApiKeyGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const xApiKey = request.headers['Authorization'].split(' ')[1];

    if (xApiKey !== envConfig.PAYMENT_API_KEY) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
