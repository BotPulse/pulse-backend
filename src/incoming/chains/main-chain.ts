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
  //TODO implement a Queue data structure that also eliminates buffers that are 24h old
  //TODO implement a better way to store initial messages
  private conversationBuffer = new Map<string, BufferMemory>();
  private model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
  });
  private buffer = new BufferMemory({
    returnMessages: true,
    memoryKey: 'history',
  });
  constructor(private readonly configService: ConfigService) {}

  public async getAnswer(user: string, input: string): Promise<string> {
    const systemPromptTemplate = `Transforma el siguiente {text},
    que contiene expresiones ofensivas, en una versión más respetuosa y cortés:`;
    const chatPromptTemplate = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPromptTemplate),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate(`{text}`),
    ]);
    const chain = new ConversationChain({
      memory: this.buffer,
      prompt: chatPromptTemplate,
      llm: this.model,
    });
    const messages = await this.buffer.chatHistory.getMessages();
    if (messages.length === 0) {
      const greetings = `Hola mi nombre es juanito, y traduzco puteadas, 
      por ejemplo si me dices: que eres bobo o tu mama te peina?
      yo te respondere algo como: ¿Eres un poco despistado o tu madre te ayuda con el peinado?`;
      await chain.memory.saveContext({ input }, { output: greetings });
      return greetings;
    }
    const response = await chain.call({
      text: input,
    });
    return response?.response;
  }
}
