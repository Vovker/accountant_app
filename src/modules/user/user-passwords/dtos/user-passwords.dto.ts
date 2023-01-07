import { AbstractDto } from '../../../../common/dto/abstract.dto';

export class UserPasswordsDto extends AbstractDto {
  password: string;

  user: number;
}
