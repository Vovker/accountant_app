import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { GetChatDto } from './dtos/get-chat.dto';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  @Get(':id')
  @Auth()
  @ApiParam({ name: 'id', type: 'string', description: 'Request id' })
  @ApiOkResponse({ type: GetChatDto })
  async getChat(@UUIDParam('id') id: Uuid, @AuthUser() user: UserEntity) {
    return this.chatService.getChat(id, user);
  }
}
