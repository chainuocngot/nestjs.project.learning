import requestIP from 'request-ip';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IP = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const clientIP = requestIP.getClientIp(request);

  return String(clientIP);
});
