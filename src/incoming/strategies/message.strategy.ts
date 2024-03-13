import { Injectable } from '@nestjs/common';
import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { WebhookPayload } from '../dto/webhook-payload.dto';
import { MessagesTypes } from './strategy-interfaces';
import { AudioMessageStrategy } from './audio-message.strategy';
import { TextMessageStrategy } from './text-message.strategy';
import { IncomingStrategyService } from './incoming-strategy.service';
import { UnknownPayloadStrategy } from './unknown-message.service';
import { Logger } from '@nestjs/common';
@Injectable()
export class MessageStrategy implements IncomingWhatsappRequestStrategy {
  constructor(
    private incomingStrategyService: IncomingStrategyService,
    private readonly textMessageStrategy: TextMessageStrategy,
    private readonly audioMessageStrategy: AudioMessageStrategy,
    private readonly unknownPayloadStrategy: UnknownPayloadStrategy,
  ) {}

  private readonly logger = new Logger(MessageStrategy.name);
  strategyMap = new Map<MessagesTypes, IncomingWhatsappRequestStrategy>([
    [MessagesTypes.AUDIO, this.audioMessageStrategy],
    [MessagesTypes.TEXT, this.textMessageStrategy],
    [MessagesTypes.UNKNOWN, this.unknownPayloadStrategy],
  ]);

  getMessageType(body: WebhookPayload) {
    const messageType = body.entry[0].changes[0].value.messages[0].type;
    this.logger.log(`Message type: ${messageType}`);
    if (
      Object.values(MessagesTypes).includes(
        messageType as unknown as MessagesTypes,
      )
    ) {
      return messageType;
    } else {
      return MessagesTypes.UNKNOWN;
    }
  }

  handleRequest(requestBody: WebhookPayload): any {
    const messageType = this.getMessageType(requestBody);
    const strategy = this.strategyMap.get(messageType as MessagesTypes);
    this.incomingStrategyService.setStategy(strategy);
    this.incomingStrategyService.handleRequest(requestBody);
  }
}
