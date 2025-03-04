import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterBodyType, SendOTPBodyType } from 'src/routes/auth/auth.model';
import { AuthRepository } from 'src/routes/auth/auth.repo';
import { RolesService } from 'src/routes/auth/roles.service';
import { isUniqueConstrainPrismaError } from 'src/shared/helpers';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(body: RegisterBodyType) {
    try {
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
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  sendOTP(body: SendOTPBodyType) {
    console.log('>> Check | body:', body);
    return body;
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
