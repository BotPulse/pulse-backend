import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAI } from 'langchain/llms/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { ConversationChain } from 'langchain/chains';
import {
  systemPromptTemplate,
  alfredoGreeting,
} from './prompts/asistant-prompt';
import { LimitedSizeMap } from './data-structures/limited-size-map';
import { BotInterface } from './bot-interface.bot';
@Injectable()
export class AlfredBot implements BotInterface {
  //TODO implement a Queue data structure that also eliminates buffers that are 24h old
  private conversationIniciated = new LimitedSizeMap();
  private model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
  });
  private chatPromptTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPromptTemplate),
    HumanMessagePromptTemplate.fromTemplate(`{text}`),
  ]);
  private chain = new ConversationChain({
    prompt: this.chatPromptTemplate,
    llm: this.model,
  });
  private phoneNumber: string;
  constructor(private readonly configService: ConfigService) {}
  public setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }
  public getPhoneNumber(): string {
    return this.phoneNumber;
  }
  public async getAnswer(user: string, input: string): Promise<string> {
    const userConversation = this.conversationIniciated.get(user);
    if (!userConversation) {
      this.conversationIniciated.set(user, { messageCount: 1 });
      return alfredoGreeting;
    }
    if (userConversation && userConversation.messageCount < 2) {
      this.conversationIniciated.set(user, {
        messageCount: userConversation.messageCount + 1,
      });
      const response = await this.chain.call({
        text: input,
      });
      return `${response?.response} 
Si te interesa *implementar un bot inteligente en tu negocio*,
escribele a mi colega de botpulse, este es su numero +593994515729`;
    }
    this.conversationIniciated.set(user, {
      messageCount: userConversation.messageCount + 1,
    });
    const response = await this.chain.call({
      text: input,
    });
    return response?.response;
  }
}

export const AlfredBotProvider: Provider = {
  provide: AlfredBot,
  useClass: AlfredBot,
};
