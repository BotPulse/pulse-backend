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
//import { asistantPrompt } from './asistant-prompt';
@Injectable()
export class OpenAIChat {
  constructor(private readonly configService: ConfigService) {}

  //TODO implement a Queue data structure that also eliminates buffers that are < 24h
  public async getAnswer(input: string): Promise<string> {
    const openAIApiKey = this.configService.get<string>('OPENAI_API_KEY');
    const model = new ChatOpenAI({
      temperature: 0,
      openAIApiKey,
    });
    const systemPromptTemplate = `Transforma el siguiente texto,
    que contiene expresiones ofensivas, en una versión más respetuosa y cortés:`;

    const chatPromptTemplate = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPromptTemplate),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate(`{input}`),
    ]);
    const chain = new ConversationChain({
      memory: new BufferMemory({ returnMessages: true, memoryKey: 'history' }),
      prompt: chatPromptTemplate,
      llm: model,
    });
    //const messages = chain.memory.getMessages();
    const memoryVariables = await chain.memory.loadMemoryVariables({});
    console.log(memoryVariables.history);
    const response = await chain.call({
      input,
    });
    return response?.response;
  }
}
