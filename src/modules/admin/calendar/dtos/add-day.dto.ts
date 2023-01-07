import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Calendar } from '../../../../constants/calendar';

export class AddDayDto {
  @ApiProperty()
  @IsNotEmpty()
  day: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Calendar)
  type: Calendar;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
