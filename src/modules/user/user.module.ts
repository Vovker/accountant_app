import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserPasswordsModule } from './user-passwords/user-passwords.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserPasswordsModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
