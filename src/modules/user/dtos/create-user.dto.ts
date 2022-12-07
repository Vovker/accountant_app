import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';

import { RoleType } from '../../../constants';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  readonly firstName: string;

  @IsString()
  @ApiProperty()
  readonly lastName: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsBoolean()
  @ApiProperty()
  readonly isActive?: boolean;

  @IsEnum([RoleType.EMPLOYEE, RoleType.ACCOUNTANT, RoleType.MANAGER])
  @ApiProperty({ enum: RoleType })
  readonly role: RoleType;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
