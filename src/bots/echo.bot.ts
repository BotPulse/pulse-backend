import { Injectable } from '@nestjs/common';
import { BotInterface } from './bot-interface.bot';
import { Provider } from '@nestjs/common';
@Injectable()
export class EchoBot implements BotInterface {
  constructor() {}
  public setPhoneNumber(phoneNumber: string): void {
    console.log(phoneNumber);
  }
  public getPhoneNumber(): string {
    return '';
  }
  public getAnswer(user: string, input: string): Promise<string> {
    const answer = `🤖: ${input}`;
    return Promise.resolve(answer);
  }
}

export const EchoBotProvider: Provider = {
  provide: EchoBot,
  useClass: EchoBot,
};
