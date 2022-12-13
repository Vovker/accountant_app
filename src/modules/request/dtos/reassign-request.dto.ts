import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReassignRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @Transform((params) => params.value.toLowerCase())
  accountant_id: Uuid;
}
