import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Brackets, Repository } from 'typeorm';

import { RequestStatus } from '../../constants';
import { RequestEntity } from '../request/request.entity';
import type { UserEntity } from '../user/user.entity';
import { ChatEntity } from './chat.entity';
import type { MessageDto } from './dtos/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
  ) {}

  async validateRequest(
    requestId: Uuid,
    user: UserEntity,
  ): Promise<RequestEntity | null> {
    const request = this.requestRepository.createQueryBuilder('request');
    request.where('request.id = :id', { id: requestId }).andWhere(
      new Brackets((qb) => {
        qb.where('request.requester_id = :user_id', {
          user_id: user.id,
        }).orWhere('request.accountant_id = :user_id', { user_id: user.id });
      }),
    );
    const result = await request.getOne();

    if (
      !result ||
      result.status === RequestStatus.COMPLETED ||
      result.status === RequestStatus.REJECTED
    ) {
      return null;
    }

    return result;
  }

  private async getRecipient(
    request: RequestEntity,
    user: UserEntity,
  ): Promise<UserEntity> {
    const req = await this.requestRepository.findOne({
      where: { id: request.id._uuidBrand },
      relations: ['requester_id', 'accountant_id'],
    });

    if (req) {
      if (req.requester_id.id === user.id) {
        return req.accountant_id;
      }

      return req.requester_id;
    }

    throw new WsException('Request not found');
  }

  async saveMessage(
    message: MessageDto,
    user: UserEntity,
  ): Promise<{ chat: ChatEntity; recipient: UserEntity }> {
    const request = await this.validateRequest(message.requestId, user);

    if (request) {
      const newMessage = this.chatRepository.create(message);
      newMessage.user = user;
      newMessage.request = request;

      return {
        chat: await this.chatRepository.save(newMessage),
        recipient: await this.getRecipient(request, user),
      };
    }

    throw new WsException(
      'Request not found or you are not allowed to access this chat',
    );
  }

  async getChat(requestId: Uuid, user: UserEntity): Promise<ChatEntity[]> {
    const request = await this.validateRequest(requestId, user);

    if (request) {
      const chat = this.chatRepository.createQueryBuilder('chat');
      chat.where('chat.request_id = :request_id', { request_id: requestId });
      chat.orderBy('chat.created_at', 'ASC');

      return chat.getMany();
    }

    return [];
  }

  async readMessages(requestId: Uuid, user: UserEntity): Promise<void> {
    const request = await this.validateRequest(requestId, user);

    if (request) {
      const chat = this.chatRepository.createQueryBuilder('chat');
      chat.where('chat.request_id = :request_id', { request_id: requestId });
      chat.andWhere('chat.user_id != :user_id', { user_id: user.id });
      chat.andWhere('chat.is_read = false');
      await chat.update().set({ isRead: true }).execute();
    }
  }
}
