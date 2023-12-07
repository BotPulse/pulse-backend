import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { WebhookPayload } from '../dto/webhook-payload';
import { Injectable, Provider } from '@nestjs/common';
import { OutcomingService } from 'src/outcoming/outcoming.service';

@Injectable()
export class UnknownPayloadStrategy implements IncomingWhatsappRequestStrategy {
  constructor(private readonly outcomingService: OutcomingService) {}
  handleRequest(requestBody: WebhookPayload): any {
    const value = requestBody.entry[0].changes[0].value;
    const from = value.messages[0].from;
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
    this.outcomingService.OutcomingMessage(response, requestBody.entry[0].id);
    return requestBody;
  }
}

export const UnknownPayloadStrategyProvider: Provider = {
  provide: UnknownPayloadStrategy,
  useClass: UnknownPayloadStrategy,
};
