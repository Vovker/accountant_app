import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDto, VirtualColumn } from '../../decorators';
import { ChatEntity } from '../chat/chat.entity';
import { RequestEntity } from '../request/request.entity';
import { UserDto } from './dtos/user.dto';
import { UserPasswordsEntity } from './user-passwords/user-passwords.entity';
import { UserSettingsEntity } from './user-settings/user-settings.entity';

export interface IUserEntity extends IAbstractEntity<UserDto> {
  firstName?: string;

  lastName?: string;

  role: RoleType;

  email?: string;

  password?: string;

  fullName?: string;
}

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> implements IUserEntity {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.EMPLOYEE })
  role: RoleType;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: false })
  isActive: boolean;

  @VirtualColumn()
  fullName: string;

  @OneToMany(() => RequestEntity, (requestEntity) => requestEntity.requester_id)
  requests: RequestEntity[];

  @OneToMany(
    () => RequestEntity,
    (requestEntity) => requestEntity.accountant_id,
  )
  accountants: RequestEntity[];

  @OneToOne(
    () => UserSettingsEntity,
    (userSettingsEntity) => userSettingsEntity.user,
  )
  settings: UserSettingsEntity;

  @OneToMany(
    () => UserPasswordsEntity,
    (userPasswordsEntity) => userPasswordsEntity.user,
  )
  passwords: UserPasswordsEntity[];

  @OneToMany(() => ChatEntity, (chatEntity) => chatEntity.user)
  chats: ChatEntity[];
}
