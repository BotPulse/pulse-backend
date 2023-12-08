import { Injectable, Inject } from '@nestjs/common';
import { BotInterface } from './bot-interface.bot';
import { ConfigService } from '@nestjs/config';
//import { BotProvider } from './bot-provider';
@Injectable()
export class BotFactory {
  constructor(
    @Inject('BotProvider')
    private readonly botProvider: Map<string, BotInterface>,
    private readonly configService: ConfigService,
  ) {}
  public createBot(phoneNumber: string): BotInterface {
    const bot = this.botProvider.get(phoneNumber);
    if (!bot) {
      throw new Error('Bot not found');
    }
    bot.setPhoneNumber(phoneNumber);
    return bot;
  }
}
