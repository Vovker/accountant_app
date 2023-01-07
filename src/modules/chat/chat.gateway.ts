import { UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WsExceptionFilter } from '../../filters/ws-exception.filter';
import { wsAuthMiddleware } from '../../interceptors/ws.auth-user.middleware';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { ChatDto } from './dtos/chat.dto';
import { ClientDto } from './dtos/client.dto';
import { MessageDto } from './dtos/message.dto';

@WebSocketGateway(3001)
@UseFilters(new WsExceptionFilter())
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: ClientDto,
    payload: MessageDto,
  ): Promise<void> {
    try {
      const data = await this.chatService.saveMessage(payload, client.user);
      this.server.to(payload.requestId).emit('newMessage', data.chat);
      this.server.to(data.recipient.id).emit('newMessage', data.chat);
    } catch (error) {
      client.emit('error', error);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: ClientDto, payload: ChatDto): Promise<void> {
    await this.chatService
      .validateRequest(payload.requestId, client.user)
      .then(async (result) => {
        if (result) {
          await client.join(payload.requestId);
        }
      });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: ClientDto, payload: ChatDto): Promise<void> {
    await this.chatService
      .validateRequest(payload.requestId, client.user)
      .then(async (result) => {
        if (result) {
          await client.leave(payload.requestId);
        }
      });
  }

  @SubscribeMessage('readChat')
  async handleReadChat(client: ClientDto, payload: ChatDto): Promise<void> {
    await this.chatService.readMessages(payload.requestId, client.user);
    this.server.to(payload.requestId).emit('readChat', payload);
  }

  afterInit(server: Server) {
    const middle = wsAuthMiddleware(
      this.jwtService,
      this.userService,
      this.apiConfigService,
    );
    server.use(middle);
  }

  async handleDisconnect(client: ClientDto) {
    await client.leave(client.user.id);
  }

  async handleConnection(client: ClientDto) {
    await client.join(client.user.id);
  }
}
