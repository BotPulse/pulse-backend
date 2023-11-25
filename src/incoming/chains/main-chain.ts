import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';
import { systemPromptTemplate } from './prompt';
import { config } from 'dotenv';
config();

const model = new ChatOpenAI({
  temperature: 0,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
});

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

const gptChain = async (input: any) => {
  const response = await chain.call({
    input,
  });
  return response?.response;
  console.log(input);
};

export default gptChain;
