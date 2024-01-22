import { WebhookPayload } from '../dto/webhook-payload.dto';
import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { Injectable, Provider, Logger} from '@nestjs/common';
import { CreateMessageStatusDto } from '../../conversations/dto/create-status.dto';
import { MessageStatusEnum } from '../../conversations/schemas/statuses.schema';
import { StatusesService } from 'src/conversations/statuses/statuses.service';
@Injectable()
export class MessageStatusStrategy implements IncomingWhatsappRequestStrategy {
  private readonly logger = new Logger('MessageStatus');
  constructor(private statusesService: StatusesService) {}

  async handleRequest(requestBody: WebhookPayload): Promise<any> {
    //TODO: get the id and use it to update the message
    const value = requestBody.entry[0].changes[0].value;
    const status = value.statuses[0].status;
    const id = value.statuses[0].id;
    const recipient_id = value.statuses[0].recipient_id;
    const newStatus: CreateMessageStatusDto = {
      status: status as MessageStatusEnum,
      timestamp: value.statuses[0].timestamp,
      id: id,
      recipient_id: recipient_id,
    };
    await this.statusesService.createOrUpdate(newStatus);
    this.logger.log(`Message status from ${recipient_id} updated: ${status}`);
    return requestBody;
  }
}

export const MessageStatusStrategyProvider: Provider = {
  provide: MessageStatusStrategy,
  useClass: MessageStatusStrategy,
};
