import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';
//import { systemPromptTemplate } from './prompt';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const model = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: configService.get<string>('OPENAI_API_KEY'),
  modelName: 'gpt-3.5-turbo',
});
const systemPromptTemplate = `eres un asistente virtual llamado Andr'es,
que se encarga de dar nombres de personas, no sabes hacer otra cosa y no 
respondas otro tipo de preguntas`;
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

export const gptChain = async (input: any) => {
  const response = await chain.call({
    input,
  });
  return response?.response;
};
