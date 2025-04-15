import { HttpException, Injectable } from '@nestjs/common';
import {
  Disable2FABodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOTPBodyType,
} from 'src/routes/auth/auth.model';
import { AuthRepository } from 'src/routes/auth/auth.repo';
import { generateOTP, isNotFoundPrismaError, isUniqueConstrainPrismaError } from 'src/shared/helpers';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { HashingService } from 'src/shared/services/hashing.service';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import envConfig from 'src/shared/config';
import { TypeOfVerificationCode, TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant';
import { EmailService } from 'src/shared/services/email.service';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPException,
  InvalidTOTPAndCodeException,
  InvalidTOTPException,
  OTPExpiredException,
  RefreshTokenAlreadyUsedException,
  TOTPAlreadyEnabledException,
  TOTPNotEnabledException,
  UnauthorizedAccessException,
} from 'src/routes/auth/auth.error';
import { TwoFAService } from 'src/shared/services/2fa.service';
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo';
import { InvalidPasswordException } from 'src/shared/error';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly twoFAService: TwoFAService,
  ) {}

  async validateVerificationCode({
    email,
    code,
    type,
  }: {
    email: string;
    code: string;
    type: TypeOfVerificationCodeType;
  }) {
    const verificationCode = await this.authRepository.findUniqueVerificationCode({
      email_code_type: {
        email,
        code,
        type,
      },
    });

    if (!verificationCode) {
      throw InvalidOTPException;
    }

    if (verificationCode.expiresAt < new Date()) {
      throw OTPExpiredException;
    }

    return verificationCode;
  }

  async register(body: RegisterBodyType) {
    try {
      await this.validateVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.Register,
      });

      const clientRoleId = await this.sharedRoleRepository.getClientRoleId();
      const hashedPassword = await this.hashingService.hash(body.password);
      const [user] = await Promise.all([
        this.authRepository.createUser({
          email: body.email,
          name: body.name,
          phoneNumber: body.phoneNumber,
          password: hashedPassword,
          roleId: clientRoleId,
        }),
        this.authRepository.deleteVerificationCode({
          email_code_type: {
            email: body.email,
            code: body.code,
            type: TypeOfVerificationCode.Register,
          },
        }),
      ]);

      return user;
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw EmailAlreadyExistsException;
      }

      throw error;
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });

    if (body.type === TypeOfVerificationCode.Register && user) {
      throw EmailAlreadyExistsException;
    }
    if (body.type === TypeOfVerificationCode.ForgotPassword && !user) {
      throw EmailNotFoundException;
    }

    const code = generateOTP();
    await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)),
    });

    //Send OTP to email
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    });

    if (error) {
      throw FailedToSendOTPException;
    }

    return {
      message: 'Send OTP code successful',
    };
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueUserIncludeRole({
      email: body.email,
    });

    if (!user) {
      throw EmailNotFoundException;
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password);

    if (!isPasswordMatch) {
      throw InvalidPasswordException;
    }

    if (user.totpSecret) {
      if (!body.totpCode && !body.code) {
        throw InvalidTOTPAndCodeException;
      }

      if (body.totpCode) {
        const isValid = this.twoFAService.verifyTOTP({
          email: user.email,
          secret: user.totpSecret,
          token: body.totpCode,
        });

        if (!isValid) {
          throw InvalidTOTPException;
        }
      } else if (body.code) {
        await this.validateVerificationCode({
          email: user.email,
          code: body.code,
          type: TypeOfVerificationCode.Login,
        });
      }
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
        throw RefreshTokenAlreadyUsedException;
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

      throw UnauthorizedAccessException;
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
        throw RefreshTokenAlreadyUsedException;
      }

      throw UnauthorizedAccessException;
    }
  }

  async forgotPassword(body: ForgotPasswordBodyType) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });

    if (!user) {
      throw EmailNotFoundException;
    }

    await this.validateVerificationCode({
      email: body.email,
      code: body.code,
      type: TypeOfVerificationCode.ForgotPassword,
    });

    const hashedPassword = await this.hashingService.hash(body.newPassword);
    await Promise.all([
      this.sharedUserRepository.update(
        {
          id: user.id,
        },
        {
          password: hashedPassword,
          updatedById: user.id,
        },
      ),
      this.authRepository.deleteVerificationCode({
        email_code_type: {
          email: body.email,
          code: body.code,
          type: TypeOfVerificationCode.ForgotPassword,
        },
      }),
    ]);

    return {
      message: 'Change passsword success',
    };
  }

  async setup2FA(userId: number) {
    const user = await this.sharedUserRepository.findUnique({
      id: userId,
    });

    if (!user) {
      throw EmailNotFoundException;
    }

    if (user.totpSecret) {
      throw TOTPAlreadyEnabledException;
    }

    const { secret, uri } = this.twoFAService.generateTOTPSecret(user.email);

    await this.sharedUserRepository.update(
      {
        id: userId,
      },
      {
        totpSecret: secret,
        updatedById: userId,
      },
    );

    return {
      secret,
      uri,
    };
  }

  async disable2FA(body: Disable2FABodyType, userId: number) {
    const user = await this.sharedUserRepository.findUnique({
      id: userId,
    });

    if (!user) {
      throw EmailNotFoundException;
    }

    if (!user.totpSecret) {
      throw TOTPNotEnabledException;
    }

    if (body.totpCode) {
      const isValid = this.twoFAService.verifyTOTP({
        email: user.email,
        secret: user.totpSecret,
        token: body.totpCode,
      });

      if (!isValid) {
        throw InvalidTOTPException;
      }
    } else if (body.code) {
      await this.validateVerificationCode({
        email: user.email,
        code: body.code,
        type: TypeOfVerificationCode.Disabled_2FA,
      });
    }

    await this.sharedUserRepository.update(
      {
        id: userId,
      },
      {
        totpSecret: null,
        updatedById: userId,
      },
    );

    return {
      message: 'Disable TOTP success',
    };
  }
}
