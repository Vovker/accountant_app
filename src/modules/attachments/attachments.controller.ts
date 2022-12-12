import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ApiFile, Auth } from '../../decorators';
import { IFile } from '../../interfaces';
import { ValidatorService } from '../../shared/services/validator.service';
import { AttachmentsService } from './attachments.service';

@Controller('attachments')
@ApiTags('attachments')
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly validatorService: ValidatorService,
  ) {}

  @Post()
  @Auth()
  @ApiOkResponse({ description: 'File' })
  @ApiFile({ name: 'file' })
  uploadFile(@UploadedFile() file: IFile): string {
    if (
      !this.validatorService.isAllowed(file.mimetype, [
        'image/jpeg',
        'image/png',
      ])
    ) {
      throw new BadRequestException('Only images are allowed');
    }

    return this.attachmentsService.create(file);
  }
}
