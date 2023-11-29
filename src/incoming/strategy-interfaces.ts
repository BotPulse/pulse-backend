import { WebhookPayload } from './dto/webhook-payload';

export interface IncomingWhatsappRequestStrategy {
  handleRequest(requestBody: WebhookPayload);
}

export enum IncomingWhatsappRequestStrategyType {
  TEXT = 'text',
  STATUS = 'status',
  UNKNOWN = 'unknown',
}
