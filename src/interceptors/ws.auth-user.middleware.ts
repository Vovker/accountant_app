import type { JwtService } from '@nestjs/jwt';
import type { Socket } from 'socket.io';

import type { UserEntity } from '../modules/user/user.entity';
import type { UserService } from '../modules/user/user.service';
import type { ApiConfigService } from '../shared/services/api-config.service';

export interface IAuthSocket extends Socket {
  user: UserEntity;
}

export type ISocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

export const wsAuthMiddleware =
  (
    jwtService: JwtService,
    userService: UserService,
    apiConfigService: ApiConfigService,
  ): ISocketMiddleware =>
  async (socket: IAuthSocket, next) => {
    try {
      const token = socket.handshake.headers.authorization || '';
      const jwtPayload = jwtService.verify(token, {
        secret: apiConfigService.authConfig.publicKey,
      });
      socket.user = await userService.getUser(jwtPayload.userId as Uuid);
      next();
    } catch {
      next({
        name: 'Unauthorized',
        message: 'Unauthorized',
      });
    }
  };
