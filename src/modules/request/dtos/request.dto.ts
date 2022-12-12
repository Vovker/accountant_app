import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { RequestStatus } from '../../../constants/request-status';

export class RequestDto extends AbstractDto {
  title: string;

  subject: string;

  accountant_id: Uuid;

  status: RequestStatus;
}
