import { Injectable } from '@nestjs/common';
import { WebhookPayload } from 'src/incoming/dto/webhook-payload.dto';
import { StrategiesProvider } from './providers/strategies-provider';
import { IncomingWhatsappRequestStrategyType } from 'src/incoming/strategies/strategy-interfaces';
import { IncomingStrategyService } from 'src/incoming/strategies/incoming-strategy.service';
@Injectable()
export class BpassistantService {
  constructor(
    private readonly strategiesProvider: StrategiesProvider,
    private readonly incomingStrategyService: IncomingStrategyService,
  ) {}

  getPayloadType(
    webhookPayload: WebhookPayload,
  ): IncomingWhatsappRequestStrategyType {
    const value = webhookPayload.entry[0].changes[0].value;
    if (value.hasOwnProperty('statuses')) {
      return IncomingWhatsappRequestStrategyType.STATUS;
    }
    if (value.hasOwnProperty('messages')) {
      return IncomingWhatsappRequestStrategyType.MESSAGES;
    }
    return IncomingWhatsappRequestStrategyType.UNKNOWN;
  }
  public processMessage(body: WebhookPayload) {
    const strategy = this.strategiesProvider.getStrategy(
      this.getPayloadType(body),
    );
    this.incomingStrategyService.setStategy(strategy);
    this.incomingStrategyService.handleRequest(body);
    return 'ok';
  }
}
