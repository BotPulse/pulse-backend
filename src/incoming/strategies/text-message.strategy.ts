import { WebhookPayload, MessagesType } from '../dto/webhook-payload.dto';
import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { Injectable, Provider, Logger } from '@nestjs/common';
import { CustomWhatsappAnswer } from 'src/outcoming/dto/custom-response.dto';
import { OutcomingService } from 'src/outcoming/outcoming.service';
import { ConversationsService } from 'src/conversations/conversations.service';
import { CreateConversationDto } from 'src/conversations/dto/create-conversation.dto';
import { BotsService } from 'src/bots/bots.service';
@Injectable()
export class TextMessageStrategy implements IncomingWhatsappRequestStrategy {
  private logger = new Logger('TextMessageStrategy');
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly outcomingService: OutcomingService,
    private readonly botsService: BotsService,
  ) {}

  async handleRequest(
    requestBody: WebhookPayload,
  ): Promise<CustomWhatsappAnswer> {
    const value = requestBody.entry[0].changes[0].value;
    const body = value.messages[0].text.body;
    const from = value.messages[0].from;
    const contact = value.contacts[0].profile.name;
    const senderNumber = value.metadata.display_phone_number;
    const bot = this.botsService.createBot(senderNumber);
    const AIMessage = await bot.getAnswer(from, body);
    this.logger.log(`Incoming message from ${from} ${contact}: ${body}`);
    this.logger.log(`AI response: ${AIMessage}`);
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
    const outcomingMessage = await this.outcomingService.OutcomingMessage(
      response,
      senderNumber,
    );
    const outcomingMessageId = outcomingMessage.messages[0].id;
    const displayPhoneNumber =
      requestBody.entry[0].changes[0].value.metadata.display_phone_number;
    const createConversation: CreateConversationDto = {
      from,
      whatsapp_business_account_id: requestBody.entry[0].id,
      display_phone_number: displayPhoneNumber,
      phone_number_id:
        requestBody.entry[0].changes[0].value.metadata.phone_number_id,
      contacts: [
        {
          wa_id: value.contacts[0].wa_id,
          profile_name: value.contacts[0].profile.name,
        },
      ],
      messages: [
        {
          _id: value.messages[0].id,
          from: from,
          timestamp: parseInt(value.messages[0].timestamp),
          text: value.messages[0].text.body,
          type: value.messages[0].type,
        },
        {
          _id: outcomingMessageId,
          from: displayPhoneNumber,
          timestamp: Date.now(),
          text: AIMessage,
          type: MessagesType.TEXT,
        },
      ],
    };
    await this.conversationsService.createOrUpdate(createConversation);
    return response;
  }
}

export const TextMessageStrategyProvider: Provider = {
  provide: TextMessageStrategy,
  useClass: TextMessageStrategy,
};
