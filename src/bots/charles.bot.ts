import { Injectable, Provider } from '@nestjs/common';
import { BotInterface } from './bot-interface.bot';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAI } from 'langchain/llms/openai';
import {
  ChatPromptTemplate,
  // HumanMessagePromptTemplate,
  // MessagesPlaceholder,
  // SystemMessagePromptTemplate,
  PromptTemplate,
} from 'langchain/prompts';
import { ConversationChain } from 'langchain/chains';
import { LimitedSizeMap } from './data-structures/limited-size-map';
import { ConfigService } from '@nestjs/config';
import { charlesPromptTemplate } from './prompts/asistant-prompt';
import { BufferMemory } from 'langchain/memory';
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from 'langchain/agents';
import { RunnableSequence } from 'langchain/schema/runnable';
import { AgentStep, BaseMessage } from 'langchain/schema';
import { formatLogToString } from 'langchain/agents/format_scratchpad/log';
import { renderTextDescription } from 'langchain/tools/render';
import { ReActSingleInputOutputParser } from 'langchain/agents/react/output_parser';
import { DynamicTool } from 'langchain/tools';

@Injectable()
export class CharlesBot implements BotInterface {
  private userHistory = new LimitedSizeMap();
  private phoneNumber: string;
  private model: ChatOpenAI;
  private memory: BufferMemory;
  private tools: DynamicTool[];
  private prompt: PromptTemplate;
  private toolNames: string[];
  private promptWithInputs: any;
  private runnableAgent: RunnableSequence;
  private modelWithStop;
  private executor: AgentExecutor;
  constructor(private configService: ConfigService) {}
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
        memoryKey: 'chat_history',
      });
    } else {
      this.memory = userBuffer;
    }
  }
  async getAnswer(user: string, input: string): Promise<string> {
    this.setMemory(user);

    const model = new OpenAI({
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    const modelWithStop = model.bind({
      stop: ['\nObservation'],
    });
    const tools = [
      new DynamicTool({
        name: 'saveEmail',
        description:
          'call this to save the email of the user, input shoud be a string ',
        func: async (input: string) => {
          console.log(input);
          return input;
        },
      }),
    ];
    // this.memory = new BufferMemory({
    //   returnMessages: true,
    //   memoryKey: 'chat_history',
    // });
    const prompt = PromptTemplate.fromTemplate(charlesPromptTemplate);

    const toolNames = tools.map((tool) => tool.name);

    // const promptWithInputs = prompt.partial({
    //   tools: renderTextDescription(this.tools),
    //   tool_names: toolNames.join(', '),
    // });

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: 'chat-conversational-react-description',
      verbose: true,
      memory: this.memory,
    });

    const response = await executor.call({
      input,
    });
    this.memory.saveContext(
      {
        input,
      },
      { output: response?.response },
    );
    this.userHistory.set(user, this.memory);
    return response?.output;
  }
}

export const CharlesBotProvider: Provider = {
  provide: CharlesBot,
  useClass: CharlesBot,
};
