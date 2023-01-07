import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { Calendar } from '../../../../constants/calendar';

export class CalendarDto extends AbstractDto {
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
