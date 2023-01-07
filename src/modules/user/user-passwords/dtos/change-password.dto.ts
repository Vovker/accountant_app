import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Match } from '../../../../decorators/match.decorator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Match(ChangePasswordDto, (o: ChangePasswordDto) => o.password)
  newPassword: string;
}
