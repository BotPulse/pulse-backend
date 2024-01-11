import { MessageStatusEnum } from '../schemas/statuses.schema';

export class CreateMessageStatusDto {
  status: MessageStatusEnum;
  timestamp: number;
  id: string;
  recipient_id: string;
}
