import { IncomingWhatsappRequestStrategy } from './incoming-strategy';
import { WebhookPayload } from '../dto/webhook-payload';
export class UnknownPayloadStrategy implements IncomingWhatsappRequestStrategy {
  handleRequest(requestBody: WebhookPayload): WebhookPayload {
    console.log('Unknown payload');
    return requestBody;
  }
}
