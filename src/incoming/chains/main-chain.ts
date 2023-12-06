import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { ConversationChain } from 'langchain/chains';
import { systemPromptTemplate, greetings } from './asistant-prompt';
import { LimitedSizeMap } from './limited-size-map';
@Injectable()
export class OpenAIChat {
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
  constructor(private readonly configService: ConfigService) {}

  public async getAnswer(user: string, input: string): Promise<string> {
    const hasConversationIniciated = this.conversationIniciated.get(user);
    if (!hasConversationIniciated) {
      this.conversationIniciated.set(user, true);
      return greetings;
    }
    const response = await this.chain.call({
      text: input,
    });
    return response?.response;
  }
}
