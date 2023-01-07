import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ChatEntity } from '../chat/chat.entity';
@Entity({ name: 'attachments' })
export class AttachmentsEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  type: string;

  @ManyToOne(() => ChatEntity, (chatEntity) => chatEntity.attachments)
  chats: ChatEntity;
}
