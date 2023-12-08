import { Injectable, Provider } from '@nestjs/common';
import { BotInterface } from './bot-interface.bot';
@Injectable()
export class CharlesBot implements BotInterface {
  private phoneNumber: string;
  constructor() {}
  public setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }
  public getPhoneNumber(): string {
    return this.phoneNumber;
  }
  async getAnswer(user: string, input: string): Promise<string> {
    return `${user} ${input}`;
  }
}

export const CharlesBotProvider: Provider = {
  provide: CharlesBot,
  useClass: CharlesBot,
};
