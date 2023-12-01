import { WebhookPayload } from '../dto/webhook-payload';
import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { Injectable, Provider } from '@nestjs/common';

@Injectable()
export class MessageStatusStrategy implements IncomingWhatsappRequestStrategy {
  handleRequest(requestBody: WebhookPayload): any {
    //TODO: get the id and use it to update the message
    const value = requestBody.entry[0].changes[0].value;
    const status = value.statuses[0].status;
    const from = value.statuses[0].recipient_id;
    console.log(`Message status from ${from}: ${status}`);
    return requestBody;
  }
}

export const MessageStatusStrategyProvider: Provider = {
  provide: MessageStatusStrategy,
  useClass: MessageStatusStrategy,
};
