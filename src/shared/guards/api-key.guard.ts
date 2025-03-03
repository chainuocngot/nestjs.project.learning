import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import envConfig from 'src/shared/config';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const xApiKey = request.headers['x-api-key'];

    if (xApiKey !== envConfig.SECRET_API_KEY) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
