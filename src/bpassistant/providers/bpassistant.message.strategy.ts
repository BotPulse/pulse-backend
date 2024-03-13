import { MessageStrategy } from 'src/incoming/strategies/message.strategy';
import { Injectable } from '@nestjs/common';
import { AuthNumbersService } from 'src/conversations/auth-numbers/auth-numbers.service';
import { WebhookPayload } from 'src/incoming/dto/webhook-payload.dto';
import { IncomingStrategyService } from 'src/incoming/strategies/incoming-strategy.service';
import { TextMessageStrategy } from 'src/incoming/strategies/text-message.strategy';
import { AudioMessageStrategy } from 'src/incoming/strategies/audio-message.strategy';
import { UnknownPayloadStrategy } from 'src/incoming/strategies/unknown-message.service';
import { OutcomingService } from 'src/outcoming/outcoming.service';
@Injectable()
export class BpassistantMessageStrategy extends MessageStrategy {
  constructor(
    private readonly outcomingService: OutcomingService,
    private readonly authNumbersService: AuthNumbersService,
    incomingStrategyService: IncomingStrategyService,
    textMessageStrategy: TextMessageStrategy,
    audioMessageStrategy: AudioMessageStrategy,
    unknownPayloadStrategy: UnknownPayloadStrategy,
  ) {
    super(
      incomingStrategyService,
      textMessageStrategy,
      audioMessageStrategy,
      unknownPayloadStrategy,
    );
  }

  getSenderNumber(requestBody: WebhookPayload) {
    return requestBody.entry[0].changes[0].value.messages[0].from;
  }

  async handleRequest(requestBody: WebhookPayload) {
    const senderNumber = this.getSenderNumber(requestBody);
    const number = await this.authNumbersService.numberExists(senderNumber);
    const value = requestBody.entry[0].changes[0].value;
    const displayPhoneNumber = value.metadata.display_phone_number;

    if (number) {
      super.handleRequest(requestBody);
    } else {
      const answer = `🤖: Lo siento tu numero telefonico 
      no esta autorizado para su uso`;
      const response = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: senderNumber,
        from: requestBody.entry[0].id,
        type: 'text',
        text: {
          preview_url: false,
          body: answer,
        },
      };
      this.outcomingService.OutcomingMessage(response, displayPhoneNumber);
    }
  }
}
