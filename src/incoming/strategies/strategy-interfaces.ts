import { WebhookPayload } from '../dto/webhook-payload.dto';
import { CustomWhatsappAnswer } from 'src/outcoming/dto/custom-response.dto';
import { WhatsappCloudAPIRequest } from 'src/outcoming/dto/whatsappRequest.dto';
export interface IncomingWhatsappRequestStrategy {
  handleRequest(
    requestBody: WebhookPayload,
  ): Promise<CustomWhatsappAnswer | WhatsappCloudAPIRequest> | any;
}

export enum IncomingWhatsappRequestStrategyType {
  STATUS = 'status',
  UNKNOWN = 'unknown',
  MESSAGES = 'messages',
  AUDIO = 'audio',
  TEXT = 'text',
}

export enum MessagesTypes {
  AUDIO = 'audio',
  TEXT = 'text',
  UNKNOWN = 'unknown',
}