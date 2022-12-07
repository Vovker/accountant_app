import { UnauthorizedException } from '@nestjs/common';

export class WrongSecretKeyException extends UnauthorizedException {
  constructor(error?: string) {
    super('error.wrongSecretKey', error);
  }
}
