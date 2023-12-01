import { Injectable, Inject } from '@nestjs/common';
import { WebhookPayload } from './dto/webhook-payload';
import { IncomingStrategyService } from './strategies/incoming-strategy.service';
import {
  IncomingWhatsappRequestStrategy,
  IncomingWhatsappRequestStrategyType,
} from './strategies/strategy-interfaces';
import { ValueKeys } from './dto/webhook-payload';

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
      const type = value.messages[0].type;
      return (
        strategies.get(
          type as unknown as IncomingWhatsappRequestStrategyType,
        ) || strategies.get(IncomingWhatsappRequestStrategyType.UNKNOWN)
      );
    }

    if (value.hasOwnProperty(ValueKeys.STATUSES)) {
      return strategies.get(IncomingWhatsappRequestStrategyType.STATUS);
    }

    return strategies.get(IncomingWhatsappRequestStrategyType.UNKNOWN);
  }

  private createStrategy(
    requestBody: WebhookPayload,
  ): IncomingWhatsappRequestStrategy {
    const strategyFactory = this.getStrategyFactory(requestBody);
    return strategyFactory;
  }

  public async processMessage(body: WebhookPayload): Promise<string> {
    const strategy = this.createStrategy(body);
    this.incomingStrategyService.setStategy(strategy);
    await this.incomingStrategyService.handleRequest(body);
    return 'ok';
  }
}
