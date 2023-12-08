import { Injectable, Provider } from '@nestjs/common';
import { BotInterface } from './bot-interface.bot';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { ConversationChain } from 'langchain/chains';
import { LimitedSizeMap } from './data-structures/limited-size-map';
import { ConfigService } from '@nestjs/config';
import { charlesPromptTemplate } from './prompts/asistant-prompt';
import { BufferMemory } from 'langchain/memory';

@Injectable()
export class CharlesBot implements BotInterface {
  private userHistory = new LimitedSizeMap();
  private phoneNumber: string;
  private model: ChatOpenAI;
  private chatPromptTemplate: ChatPromptTemplate;
  private chain: ConversationChain;
  private memory: BufferMemory;
  constructor(private configService: ConfigService) {
    this.model = new ChatOpenAI({
      temperature: 0,
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.chatPromptTemplate = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(charlesPromptTemplate),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate(`{text}`),
      //HumanMessagePromptTemplate.fromTemplate(`{name}`),
    ]);
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history',
    });
    this.chain = new ConversationChain({
      prompt: this.chatPromptTemplate,
      llm: this.model,
      memory: this.memory,
    });
  }
  public setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }
  public getPhoneNumber(): string {
    return this.phoneNumber;
  }
  private setMemory(userId: string) {
    const userBuffer = this.userHistory.get(userId);
    if (!userBuffer) {
      this.memory = new BufferMemory({
        returnMessages: true,
        memoryKey: 'history',
      });
    } else {
      this.memory = userBuffer;
    }
  }
  async getAnswer(user: string, input: string): Promise<string> {
    this.setMemory(user);
    const response = await this.chain.call({
      text: input,
    });
    this.memory.saveContext(
      {
        input,
      },
      { output: response?.response },
    );
    this.userHistory.set(user, this.memory);
    return response?.response;
  }
}

export const CharlesBotProvider: Provider = {
  provide: CharlesBot,
  useClass: CharlesBot,
};
