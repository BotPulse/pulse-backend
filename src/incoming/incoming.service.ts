import { Injectable } from '@nestjs/common';
import { WebhookPayload } from './dto/webhook-payload';
import { OutcomingService } from 'src/outcoming/outcoming.service';
import { IncomingStrategyService } from './strategies/incoming-strategy.service';
import { UnknownPayloadStrategy } from './strategies/unknown-message.service';
import { TextMessageStrategy } from './strategies/text-message.strategy';
import { MessageStatusStrategy } from './strategies/message-status.strategy';
import {
  IncomingWhatsappRequestStrategy,
  IncomingWhatsappRequestStrategyType,
} from './strategies/strategy-interfaces';
import { ValueKeys } from './dto/webhook-payload';
@Injectable()
export class IncomingService {
  //TODO: Create providers for strategies and a provider for the map
  //TODO: Create a strategy factory
  //TODO: Inject the strategies map in the constructor
  constructor(
    private incomingStrategyService: IncomingStrategyService,
    private outcomingService: OutcomingService,
    private textMessageStrategy: TextMessageStrategy,
    private unknownPayloadStrategy: UnknownPayloadStrategy,
    private messageStatusStrategy: MessageStatusStrategy,
  ) {}

  private getStrategy(
    requestBody: WebhookPayload,
  ): IncomingWhatsappRequestStrategy {
    const value = requestBody.entry[0].changes[0].value;
    const strategies = new Map<
      IncomingWhatsappRequestStrategyType,
      IncomingWhatsappRequestStrategy
    >([
      [IncomingWhatsappRequestStrategyType.TEXT, this.textMessageStrategy],
      [IncomingWhatsappRequestStrategyType.STATUS, this.messageStatusStrategy],
      [
        IncomingWhatsappRequestStrategyType.UNKNOWN,
        this.unknownPayloadStrategy,
      ],
    ]);
    if (value.hasOwnProperty(ValueKeys.MESSAGES)) {
      const type = value.messages[0].type;
      const strategy = strategies.get(
        type as unknown as IncomingWhatsappRequestStrategyType,
      );
      return (
        strategy || strategies.get(IncomingWhatsappRequestStrategyType.UNKNOWN)
      );
    }

    if (value.hasOwnProperty(ValueKeys.STATUSES)) {
      return strategies.get(IncomingWhatsappRequestStrategyType.STATUS);
    }

    return strategies.get(IncomingWhatsappRequestStrategyType.UNKNOWN);
  }
  public async processMessage(body: WebhookPayload): Promise<string> {
    const strategy = this.getStrategy(body);
    this.incomingStrategyService.setStategy(strategy);
    await this.incomingStrategyService.handleRequest(body);
    return 'ok';
  }
}
