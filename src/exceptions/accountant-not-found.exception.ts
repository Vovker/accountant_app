import { NotFoundException } from '@nestjs/common';

export class AccountantNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.accountantNotFound', error);
  }
}
