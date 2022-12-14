import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, UUIDParam } from '../../decorators';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @Post('create-admin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Admin successfully added!',
    type: UserDto,
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<UserDto> {
    const admin = await this.userService.createAdmin(createAdminDto);

    return admin.toDto();
  }

  @Post('create-user')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User successfully added!',
    type: UserDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.createUser(createUserDto);

    return user.toDto();
  }

  @Put(':id')
  @Auth([RoleType.ADMIN, RoleType.MANAGER])
  @ApiParam({ name: 'id', type: String })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User successfully updated!',
    type: UserDto,
  })
  async updateUser(
    @UUIDParam('id') userId: Uuid,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  //ACTIVATE USER
  @Put(':id/activate')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User successfully activated!',
    type: UserDto,
  })
  async activateUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.activateUser(userId);
  }

  //DEACTIVATE USER
  @Put(':id/deactivate')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User successfully deactivated!',
    type: UserDto,
  })
  async deactivateUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.deactivateUser(userId);
  }
}
