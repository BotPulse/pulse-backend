import { Injectable } from '@nestjs/common';
import { BotInterface } from './bot-interface.bot';

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
    return Promise.resolve(input);
  }
}
