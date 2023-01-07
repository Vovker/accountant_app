import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../auth/jwt.strategy';
import { RequestEntity } from '../request/request.entity';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ChatController } from './chat.controller';
import { ChatEntity } from './chat.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity, UserEntity, RequestEntity])],
  controllers: [ChatController],
  exports: [ChatService],
  providers: [ChatService, ChatGateway, JwtService, JwtStrategy, UserService],
})
export class ChatModule {}
