import { Body, Controller, Ip, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  LoginBodyDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterResDTO,
  RegsiterBodyDTO,
  SendOTPBodyDTO,
} from 'src/routes/auth/auth.dto';
import { AuthService } from 'src/routes/auth/auth.service';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterResDTO)
  register(@Body() body: RegsiterBodyDTO) {
    return this.authService.register(body);
  }

  @Post('otp')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body);
  }

  @Post('login')
  @IsPublic()
  login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({
      ...body,
      userAgent,
      ip,
    });
  }

  @Post('refresh-token')
  @IsPublic()
  @ZodSerializerDto(RefreshTokenResDTO)
  refreshToken(@Body() body: RefreshTokenBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    });
  }

  @Post('logout')
  @ZodSerializerDto(MessageResDTO)
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body.refreshToken);
  }
}
