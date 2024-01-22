import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { WebhookPayload } from '../dto/webhook-payload.dto';
import { Injectable, Provider } from '@nestjs/common';
import { OutcomingService } from 'src/outcoming/outcoming.service';

@Injectable()
export class UnknownPayloadStrategy implements IncomingWhatsappRequestStrategy {
  constructor(private readonly outcomingService: OutcomingService) {}
  //TODO: save unknown messages in db, modify dto and schema
  handleRequest(requestBody: WebhookPayload): any {
    const value = requestBody.entry[0].changes[0].value;
    const from = value.messages[0].from;
    const displayPhoneNumber =
      requestBody.entry[0].changes[0].value.metadata.display_phone_number;
    const response = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: from,
      from: requestBody.entry[0].id,
      type: 'text',
      text: {
        preview_url: false,
        body: 'Lo siento, no puedo responder mensajes de audio o multimedia 🙈',
      },
    };
    this.outcomingService.OutcomingMessage(response, displayPhoneNumber);
    return requestBody;
  }
}

export const UnknownPayloadStrategyProvider: Provider = {
  provide: UnknownPayloadStrategy,
  useClass: UnknownPayloadStrategy,
};
