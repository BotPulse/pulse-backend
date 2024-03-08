import { Injectable, Inject } from '@nestjs/common';
import { MessagesType, WebhookPayload } from './dto/webhook-payload.dto';
import { IncomingStrategyService } from './strategies/incoming-strategy.service';
import {
  IncomingWhatsappRequestStrategy,
  IncomingWhatsappRequestStrategyType,
} from './strategies/strategy-interfaces';
import { ValueKeys } from './dto/webhook-payload.dto';

@Injectable()
export class IncomingService {
  constructor(
    @Inject('StrategiesMap')
    private strategiesMap: Map<
      IncomingWhatsappRequestStrategyType,
      IncomingWhatsappRequestStrategy
    >,
    private incomingStrategyService: IncomingStrategyService,
  ) {}

  private getStrategyFactory(
    requestBody: WebhookPayload,
  ): IncomingWhatsappRequestStrategy {
    const value = requestBody.entry[0].changes[0].value;
    const strategies = this.strategiesMap;
    if (value.hasOwnProperty(ValueKeys.MESSAGES)) {
      const messages = value.messages;
      const type = messages[0].type;
      return (
        (strategies.get(
          type as unknown as IncomingWhatsappRequestStrategyType,
        ) as IncomingWhatsappRequestStrategy) ||
        strategies.get(IncomingWhatsappRequestStrategyType.UNKNOWN)
      );
    }
    if (value.hasOwnProperty(ValueKeys.STATUSES)) {
      return strategies.get(IncomingWhatsappRequestStrategyType.STATUS);
    }

    return strategies.get(IncomingWhatsappRequestStrategyType.UNKNOWN);
  }

  public async processMessage(body: WebhookPayload): Promise<string> {
    const strategy = this.getStrategyFactory(body);
    this.incomingStrategyService.setStategy(strategy);
    await this.incomingStrategyService.handleRequest(body);
    return 'ok';
  }
}
