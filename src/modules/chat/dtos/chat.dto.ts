import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';

export class ChatDto extends AbstractDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  requestId: Uuid;
}
