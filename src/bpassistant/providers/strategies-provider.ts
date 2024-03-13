import { Injectable } from '@nestjs/common';
import { MessageStatusStrategy } from 'src/incoming/strategies/message-status.strategy';
import { UnknownPayloadStrategy } from 'src/incoming/strategies/unknown-message.service';
import {
  IncomingWhatsappRequestStrategyType,
  IncomingWhatsappRequestStrategy,
} from 'src/incoming/strategies/strategy-interfaces';
import { BpassistantMessageStrategy } from './bpassistant.message.strategy';
@Injectable()
export class StrategiesProvider {
  constructor(
    private readonly messageStrategy: BpassistantMessageStrategy,
    private readonly statusStrategy: MessageStatusStrategy,
    private readonly unknownPayloadStrategy: UnknownPayloadStrategy,
  ) {}

  strategyMap = new Map<
    IncomingWhatsappRequestStrategyType,
    IncomingWhatsappRequestStrategy
  >([
    [IncomingWhatsappRequestStrategyType.MESSAGES, this.messageStrategy],
    [IncomingWhatsappRequestStrategyType.STATUS, this.statusStrategy],
    [IncomingWhatsappRequestStrategyType.UNKNOWN, this.unknownPayloadStrategy],
  ]);

  getStrategy(type: IncomingWhatsappRequestStrategyType) {
    return this.strategyMap.get(type) ?? this.unknownPayloadStrategy;
  }
}
