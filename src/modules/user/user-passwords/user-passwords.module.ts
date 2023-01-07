import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../../auth/auth.module';
import { UserEntity } from '../user.entity';
import { UserPasswordsController } from './user-passwords.controller';
import { UserPasswordsEntity } from './user-passwords.entity';
import { UserPasswordsService } from './user-passwords.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPasswordsEntity, UserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserPasswordsController],
  exports: [UserPasswordsService],
  providers: [UserPasswordsService],
})
export class UserPasswordsModule {}
