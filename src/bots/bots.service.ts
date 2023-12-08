import { Injectable } from '@nestjs/common';
import { BotFactory } from './bot-factory.bot';
import { BotInterface } from './bot-interface.bot';
@Injectable()
//TODO implement a bot factory
export class BotsService {
  constructor(private readonly botFactory: BotFactory) {}

  public createBot(phoneNumber: string): BotInterface {
    return this.botFactory.createBot(phoneNumber);
  }
  public getAnswer(phoneNumber: string, input: string): Promise<string> {
    const bot = this.createBot(phoneNumber);
    return bot.getAnswer(phoneNumber, input);
  }
}
