import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { RequestStatus } from '../../constants';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { RequestDto } from './dtos/request.dto';

export interface IRequestEntity extends IAbstractEntity<RequestDto> {
  title: string;

  subject: string;

  accountant_id?: UserEntity;
}

@Entity({ name: 'requests' })
@UseDto(RequestDto)
export class RequestEntity
  extends AbstractEntity<RequestDto>
  implements IRequestEntity
{
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  subject: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    nullable: false,
    default: RequestStatus.CREATED,
  })
  status: RequestStatus;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.requests)
  @JoinColumn({ name: 'requester_id' })
  requester_id: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.accountants, {
    nullable: true,
  })
  @JoinColumn({ name: 'accountant_id' })
  accountant_id: UserEntity;
}
