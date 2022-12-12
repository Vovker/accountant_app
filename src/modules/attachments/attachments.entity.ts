import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
@Entity({ name: 'attachments' })
export class AttachmentsEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  type: string;
}
