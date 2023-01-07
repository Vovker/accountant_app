import type { ArgumentsHost } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    this.handleError(client as Socket, exception);
  }

  public handleError(client: Socket, exception: HttpException | WsException) {
    if (exception instanceof HttpException) {
      client.emit('error', exception.getResponse());
    } else {
      client.emit('error', exception.getError());
    }
  }
}
