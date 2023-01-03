import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import type { SendEmailResponse } from 'aws-sdk/clients/ses';

import { Auth, AuthUser } from '../../../decorators';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../user.entity';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UserPasswordsService } from './user-passwords.service';

@Controller('user-passwords')
@ApiTags('user-passwords')
export class UserPasswordsController {
  constructor(private userPasswordsService: UserPasswordsService) {}

  @Put('change-password')
  @Auth()
  async updatePassword(
    @AuthUser() user: UserEntity,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<UserDto> {
    return this.userPasswordsService.updatePassword(user, changePasswordDto);
  }

  @Get('request-change-password')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Change password',
    type: UserDto,
  })
  async changePassword(
    @AuthUser() user: UserEntity,
  ): Promise<SendEmailResponse> {
    return this.userPasswordsService.changePasswordRequest(user);
  }

  @Get('request-change-password/:email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Change password',
  })
  @ApiParam({ name: 'email', type: String })
  async changePasswordByEmail(
    @Param('email') email: string,
  ): Promise<SendEmailResponse> {
    return this.userPasswordsService.changePasswordRequestByEmail(email);
  }
}
