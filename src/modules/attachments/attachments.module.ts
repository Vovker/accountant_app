import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentsController } from './attachments.controller';
import { AttachmentsEntity } from './attachments.entity';
import { AttachmentsService } from './attachments.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentsEntity])],
  controllers: [AttachmentsController],
  exports: [AttachmentsService],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
