import { Provider } from '@nestjs/common';
import {
  IncomingWhatsappRequestStrategy,
  IncomingWhatsappRequestStrategyType,
} from './strategy-interfaces';
import { TextMessageStrategy } from './text-message.strategy';
import { UnknownPayloadStrategy } from './unknown-message.service';
import { MessageStatusStrategy } from './message-status.strategy';
import { AudioMessageStrategy } from './audio-message.strategy';
export const StrategiesMapProvider: Provider = {
  provide: 'StrategiesMap',
  useFactory: (
    textMessageStrategy: IncomingWhatsappRequestStrategy,
    messageStatusStrategy: IncomingWhatsappRequestStrategy,
    audioMessageStrategy: IncomingWhatsappRequestStrategy,
    unknownPayloadStrategy: IncomingWhatsappRequestStrategy,
  ): Map<
    IncomingWhatsappRequestStrategyType,
    IncomingWhatsappRequestStrategy
  > => {
    return new Map([
      [IncomingWhatsappRequestStrategyType.STATUS, messageStatusStrategy],
      [IncomingWhatsappRequestStrategyType.TEXT, textMessageStrategy],
      [IncomingWhatsappRequestStrategyType.AUDIO, audioMessageStrategy],
      [IncomingWhatsappRequestStrategyType.UNKNOWN, unknownPayloadStrategy],
    ]);
  },
  inject: [
    TextMessageStrategy,
    MessageStatusStrategy,
    AudioMessageStrategy,
    UnknownPayloadStrategy,
  ],
};
