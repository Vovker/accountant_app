import { Socket } from 'socket.io';

import type { UserEntity } from '../../user/user.entity';

export class ClientDto extends Socket {
  user: UserEntity;
}
