import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { WebhookPayload } from './dto/webhook-payload';
export class UnknownPayloadStrategy implements IncomingWhatsappRequestStrategy {
  handleRequest(requestBody: WebhookPayload): WebhookPayload {
    console.log('Unknown payload');
    return requestBody;
  }
}
