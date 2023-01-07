import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';

export class MessageDto extends AbstractDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  requestId: Uuid;
}
