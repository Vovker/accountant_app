import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { IFile } from '../../interfaces';
import { AttachmentsEntity } from './attachments.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(AttachmentsEntity)
    private attachmentsRepository: Repository<AttachmentsEntity>,
  ) {}

  //upload file and save it to the database
  create(file: IFile): string {
    //upload file to the cloud
    return file.originalname;
  }
}
