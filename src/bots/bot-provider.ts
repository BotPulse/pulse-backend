import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlfredBot } from './alfred.bot';
import { BotInterface } from './bot-interface.bot';
import { CharlesBot } from './charles.bot';

export const BotProvider: Provider = {
  provide: 'BotProvider',
  useFactory: (
    configService: ConfigService,
    alfredBot: BotInterface,
    charlesBot: BotInterface,
  ): Map<string, BotInterface> =>
    new Map([
      [configService.get<string>('TEST_WA_ID'), alfredBot],
      [configService.get<string>('ALFRED_WA_ID'), charlesBot],
    ]),
  inject: [ConfigService, AlfredBot, CharlesBot],
};
