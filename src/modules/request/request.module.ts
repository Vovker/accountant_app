import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RequestController } from './request.controller';
import { RequestEntity } from './request.entity';
import { RequestService } from './request.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, UserEntity])],
  controllers: [RequestController],
  exports: [RequestService],
  providers: [RequestService, UserService],
})
export class RequestModule {}
