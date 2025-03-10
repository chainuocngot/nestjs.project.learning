import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RegisterBodyType, SendOTPBodyType } from 'src/routes/auth/auth.model';
import { AuthRepository } from 'src/routes/auth/auth.repo';
import { RolesService } from 'src/routes/auth/roles.service';
import { generateOTP, isUniqueConstrainPrismaError } from 'src/shared/helpers';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { HashingService } from 'src/shared/services/hashing.service';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import envConfig from 'src/shared/config';
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { EmailService } from 'src/shared/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUser: SharedUserRepository,
    private readonly emailService: EmailService,
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
    const user = await this.sharedUser.findUnique({
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

  // async login(body: any) {
  //   const user = await this.prismaService.user.findUnique({
  //     where: {
  //       email: body.email,
  //     },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException('Account is not exist');
  //   }

  //   const isPasswordMatch = await this.hashingService.compare(body.password, user.password);

  //   if (!isPasswordMatch) {
  //     throw new UnprocessableEntityException([
  //       {
  //         field: 'password',
  //         error: 'Password is incorrect',
  //       },
  //     ]);
  //   }

  //   const tokens = await this.generateTokens({ userId: user.id });

  //   return tokens;
  // }

  // async generateTokens(payload: { userId: number }) {
  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.tokenService.signAccessToken(payload),
  //     this.tokenService.signRefreshToken(payload),
  //   ]);

  //   const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
  //   await this.prismaService.refreshToken.create({
  //     data: {
  //       token: refreshToken,
  //       userId: payload.userId,
  //       expiresAt: new Date(decodedRefreshToken.exp * 1000),
  //     },
  //   });

  //   return {
  //     accessToken,
  //     refreshToken,
  //   };
  // }

  // async refreshToken(refreshToken: string) {
  //   try {
  //     const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);

  //     await this.prismaService.refreshToken.findUniqueOrThrow({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     return await this.generateTokens({ userId });
  //   } catch (error) {
  //     if (isNotFoundPrismaError(error)) {
  //       throw new UnauthorizedException('Refresh token has been revoked');
  //     }

  //     throw new UnauthorizedException();
  //   }
  // }

  // async logout(refreshToken: string) {
  //   try {
  //     await this.tokenService.verifyRefreshToken(refreshToken);

  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     return {
  //       message: 'Logout successfully',
  //     };
  //   } catch (error) {
  //     if (isNotFoundPrismaError(error)) {
  //       throw new UnauthorizedException('Refresh token has been revoked');
  //     }

  //     throw new UnauthorizedException();
  //   }
  // }
}
