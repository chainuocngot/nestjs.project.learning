import { HttpException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { LoginBodyType, RefreshTokenBodyType, RegisterBodyType, SendOTPBodyType } from 'src/routes/auth/auth.model';
import { AuthRepository } from 'src/routes/auth/auth.repo';
import { RolesService } from 'src/routes/auth/roles.service';
import { generateOTP, isNotFoundPrismaError, isUniqueConstrainPrismaError } from 'src/shared/helpers';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { HashingService } from 'src/shared/services/hashing.service';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import envConfig from 'src/shared/config';
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { EmailService } from 'src/shared/services/email.service';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const verificationCode = await this.authRepository.findUniqueVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.Register,
      });

      if (!verificationCode) {
        throw new UnprocessableEntityException([
          {
            message: 'OTP code is invalid',
            path: 'code',
          },
        ]);
      }

      if (verificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException([
          {
            message: 'OTP code is expired',
            path: 'code',
          },
        ]);
      }

      const clientRoleId = await this.rolesService.getClientRoleId();
      const hashedPassword = await this.hashingService.hash(body.password);
      const user = await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId,
      });

      return user;
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw new UnprocessableEntityException([
          {
            message: 'Email already exists',
            path: 'email',
          },
        ]);
      }

      throw error;
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });

    if (user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email already exists',
          path: 'email',
        },
      ]);
    }

    const code = generateOTP();
    const verificationCode = await this.authRepository.createVerificationCode({
      email: body.email,
      code: code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)),
    });

    //Send OTP to email
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    });

    if (error) {
      throw new UnprocessableEntityException([
        {
          message: 'Send OTP code failed',
          path: 'code',
        },
      ]);
    }

    return verificationCode;
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueUserIncludeRole({
      email: body.email,
    });

    if (!user) {
      throw new UnprocessableEntityException([
        {
          message: "Email doesn't exist",
          path: 'email',
        },
      ]);
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password);

    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ]);
    }

    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
    });

    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    });

    return tokens;
  }

  async generateTokens(payload: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId: payload.userId,
        deviceId: payload.deviceId,
        roleId: payload.roleId,
        roleName: payload.roleName,
      }),
      this.tokenService.signRefreshToken({
        userId: payload.userId,
      }),
    ]);

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId: payload.userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId: payload.deviceId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(body: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(body.refreshToken);

      const refreshTokenInDb = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({
        token: body.refreshToken,
      });

      if (!refreshTokenInDb) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      const $updateDevice = this.authRepository.updateDevice(refreshTokenInDb.deviceId, {
        ip: body.ip,
        userAgent: body.userAgent,
      });

      const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
        token: body.refreshToken,
      });

      const $tokens = this.generateTokens({
        userId,
        roleId: refreshTokenInDb.user.roleId,
        roleName: refreshTokenInDb.user.role.name,
        deviceId: refreshTokenInDb.deviceId,
      });

      const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens]);

      return tokens;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new UnauthorizedException();
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken);

      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
        token: refreshToken,
      });

      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false,
      });

      return {
        message: 'Logout successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      throw new UnauthorizedException();
    }
  }
}
