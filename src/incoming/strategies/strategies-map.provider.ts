import { Provider } from '@nestjs/common';
import {
  IncomingWhatsappRequestStrategy,
  IncomingWhatsappRequestStrategyType,
} from './strategy-interfaces';
import { TextMessageStrategy } from './text-message.strategy';
import { UnknownPayloadStrategy } from './unknown-message.service';
import { MessageStatusStrategy } from './message-status.strategy';

export const StrategiesMapProvider: Provider = {
  provide: 'StrategiesMap',
  useFactory: (
    textMessageStrategy: IncomingWhatsappRequestStrategy,
    messageStatusStrategy: IncomingWhatsappRequestStrategy,
    unknownPayloadStrategy: IncomingWhatsappRequestStrategy,
  ): Map<
    IncomingWhatsappRequestStrategyType,
    IncomingWhatsappRequestStrategy
  > => {
    return new Map([
      [IncomingWhatsappRequestStrategyType.TEXT, textMessageStrategy],
      [IncomingWhatsappRequestStrategyType.UNKNOWN, unknownPayloadStrategy],
      [IncomingWhatsappRequestStrategyType.STATUS, messageStatusStrategy],
    ]);
  },
  inject: [TextMessageStrategy, MessageStatusStrategy, UnknownPayloadStrategy],
};
