import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

@Injectable()
export class OpenAIChat {
  private conversationBuffer = new Map<string, BufferMemory>();
  constructor(private readonly configService: ConfigService) {}

  //TODO implement a Queue data structure that also eliminates buffers that are 24h old
  public async getAnswer(user: string, input: string): Promise<string> {
    const openAIApiKey = this.configService.get<string>('OPENAI_API_KEY');
    const model = new ChatOpenAI({
      temperature: 0,
      openAIApiKey,
    });
    const systemPromptTemplate = `Transforma el siguiente {text},
    que contiene expresiones ofensivas, en una versión más respetuosa y cortés:`;
    const chatPromptTemplate = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPromptTemplate),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate(`{text}`),
    ]);
    const buffer =
      this.conversationBuffer.get(user) ||
      new BufferMemory({ returnMessages: true, memoryKey: 'history' });

    const chain = new ConversationChain({
      memory: buffer,
      prompt: chatPromptTemplate,
      llm: model,
    });

    const response = await chain.call({
      text: input,
    });
    return response?.response;
  }
}
