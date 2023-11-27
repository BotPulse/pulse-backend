import { WebhookPayload } from '../dto/webhook-payload';
import { IncomingWhatsappRequestStrategy } from './incoming-strategy';

export class TextMessageStrategy implements IncomingWhatsappRequestStrategy {
  handleRequest(requestBody: WebhookPayload): WebhookPayload {
    const value = requestBody.entry[0].changes[0].value;
    const body = value.messages[0].text.body;
    const from = value.messages[0].from;
    console.log(`Incoming message from ${from}: ${body}`);
    return requestBody;
  }
}