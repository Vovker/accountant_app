import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { generateHash } from '../common/utils';
import { UserEntity } from '../modules/user/user.entity';
import { UserPasswordsEntity } from '../modules/user/user-passwords/user-passwords.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  async afterInsert(event: InsertEvent<UserEntity>): Promise<void> {
    const entity = event.entity;
    const userPasswordsEntity = new UserPasswordsEntity();
    userPasswordsEntity.password = entity.password;
    userPasswordsEntity.user = entity;
    await event.manager.save(userPasswordsEntity);
  }

  async afterUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    const entity = event.entity as UserEntity;
    const userPasswordsEntity = new UserPasswordsEntity();

    if (entity.password !== event.databaseEntity.password) {
      userPasswordsEntity.password = entity.password;
      userPasswordsEntity.user = entity;
      await event.manager.save(userPasswordsEntity);
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    const entity = event.entity as UserEntity;

    if (entity.password !== event.databaseEntity.password) {
      entity.password = generateHash(entity.password);
    }
  }
}
