import { Body, Controller, Get, Put } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ChangePasswordBodyDTO, UpdateMeBodyDTO } from 'src/routes/profile/profile.dto';
import { ProfileService } from 'src/routes/profile/profile.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { GetProfileResDTO, UpdateProfileResDTO } from 'src/shared/dtos/shared-user.dto';
import { UserType } from 'src/shared/models/shared-user.model';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodSerializerDto(GetProfileResDTO)
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getProfile(userId);
  }

  @Put()
  @ZodSerializerDto(UpdateProfileResDTO)
  updateProfile(@Body() body: UpdateMeBodyDTO, @ActiveUser('userId') userId: UserType['id']) {
    return this.profileService.updateProfile(userId, body);
  }

  @Put('change-password')
  @ZodSerializerDto(MessageResDTO)
  changePassword(@Body() body: ChangePasswordBodyDTO, @ActiveUser('userId') userId: UserType['id']) {
    return this.profileService.changePassword(userId, body);
  }
}
