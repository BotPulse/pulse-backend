import { WebhookPayload } from '../dto/webhook-payload';
import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { Injectable } from '@nestjs/common';
import { CustomWhatsappAnswer } from 'src/outcoming/dto/custom-response.dto';
import { OutcomingService } from 'src/outcoming/outcoming.service';
import { OpenAIChat } from '../chains/main-chain';
@Injectable()
export class TextMessageStrategy implements IncomingWhatsappRequestStrategy {
  constructor(
    private readonly openAIChat: OpenAIChat,
    private readonly outcomingService: OutcomingService,
  ) {}

  async handleRequest(
    requestBody: WebhookPayload,
  ): Promise<CustomWhatsappAnswer> {
    const value = requestBody.entry[0].changes[0].value;
    console.log(value);
    const body = value.messages[0].text.body;
    const from = value.messages[0].from;
    console.log(`Incoming message from ${from}: ${body}`);
    const AIMessage = await this.openAIChat.getAnswer(body);
    const response = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: from,
      type: 'text',
      text: {
        preview_url: false,
        body: AIMessage,
      },
    };
    await this.outcomingService.OutcomingMessage(response);
    return response;
  }
}
