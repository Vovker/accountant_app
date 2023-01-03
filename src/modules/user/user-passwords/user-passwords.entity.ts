import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { UserEntity } from '../user.entity';
import { UserPasswordsDto } from './dtos/user-passwords.dto';

export interface IUserPasswordsEntity
  extends IAbstractEntity<UserPasswordsDto> {
  password: string;
}

@Entity('user_passwords')
@UseDto(UserPasswordsDto)
export class UserPasswordsEntity
  extends AbstractEntity<UserPasswordsDto>
  implements IUserPasswordsEntity
{
  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.passwords)
  @JoinColumn({ name: 'user' })
  user: UserEntity;
}
