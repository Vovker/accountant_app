import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetCalendarDto {
  @ApiProperty()
  @IsNotEmpty()
  from: Date;

  @ApiProperty()
  @IsNotEmpty()
  to: Date;
}
