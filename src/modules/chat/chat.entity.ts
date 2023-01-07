import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { AttachmentsEntity } from '../attachments/attachments.entity';
import { RequestEntity } from '../request/request.entity';
import { UserEntity } from '../user/user.entity';
import { ChatDto } from './dtos/chat.dto';

export interface IChatEntity extends IAbstractEntity<ChatDto> {
  message: string;
  isRead: boolean;
}

@Entity({ name: 'chat' })
@UseDto(ChatDto)
export class ChatEntity extends AbstractEntity<ChatDto> implements IChatEntity {
  @Column({ nullable: false })
  message: string;

  @Column({ nullable: false, default: false })
  isRead: boolean;

  @ManyToOne(() => UserEntity, (user) => user.chats)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RequestEntity, (requestEntity) => requestEntity.id)
  @JoinColumn({ name: 'request_id' })
  request: RequestEntity;

  @OneToMany(
    () => AttachmentsEntity,
    (attachmentsEntity) => attachmentsEntity.id,
  )
  @JoinColumn({ name: 'attachment_id' })
  attachments: AttachmentsEntity[];
}
