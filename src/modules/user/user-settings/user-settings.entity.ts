import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { UserEntity } from '../user.entity';
import { UserSettingsDto } from './dtos/user-settings.dto';

export interface IUserSettingsEntity extends IAbstractEntity<UserSettingsDto> {
  vacationDays: number;
  sickDays: number;
  isVerified: boolean;
}

@Entity({ name: 'user_settings' })
@UseDto(UserSettingsDto)
export class UserSettingsEntity
  extends AbstractEntity<UserSettingsDto>
  implements IUserSettingsEntity
{
  @Column({ nullable: false, default: 0 })
  vacationDays: number;

  @Column({ nullable: false, default: 0 })
  sickDays: number;

  @Column({ nullable: false })
  hiredAt: Date;

  @Column({ nullable: false, default: false })
  isVerified: boolean;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.settings, {
    nullable: false,
  })
  @JoinColumn({ name: 'user' })
  user: UserEntity;
}
