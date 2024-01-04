import { Injectable, Provider } from '@nestjs/common';
import { BotInterface } from './bot-interface.bot';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LimitedSizeMap } from './data-structures/limited-size-map';
import { ConfigService } from '@nestjs/config';
import { charlesPromptTemplate } from './prompts/asistant-prompt';
import { BufferMemory } from 'langchain/memory';
import {
  AgentExecutor,
  StructuredChatOutputParserWithRetries,
} from 'langchain/agents';
import { RunnableSequence } from 'langchain/schema/runnable';
import { AgentStep, BaseMessage } from 'langchain/schema';
import { formatLogToString } from 'langchain/agents/format_scratchpad/log';
import { renderTextDescription } from 'langchain/tools/render';
import { ReActSingleInputOutputParser } from 'langchain/agents/react/output_parser';
import { DynamicStructuredTool, DynamicTool } from 'langchain/tools';
import { BotSaveAppointment } from './tools/bot-save-email.tool';
import { StructuredTool } from 'langchain/tools';
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
  constructor(
    private configService: ConfigService,
    private botSaveAppointment: BotSaveAppointment,
  ) {}
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
    const model = new ChatOpenAI({ modelName: 'gpt-4' });
    /** Bind a stop token to the model */
    const modelWithStop = model.bind({
      stop: ['\nObservation'],
    });
    //const tools = [this.botSaveAppointment.saveEmailAppointment()];
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
    const prompt = PromptTemplate.fromTemplate(charlesPromptTemplate);
    const toolNames = tools.map((tool) => tool.name);
    const promptWithInputs = await prompt.partial({
      tools: renderTextDescription(tools),
      tool_names: toolNames.join(','),
    });
    const outputParser = StructuredChatOutputParserWithRetries.fromLLM(model, {
      toolNames,
    });
    const runnableAgent = RunnableSequence.from([
      {
        input: (i: {
          input: string;
          steps: AgentStep[];
          chat_history: BaseMessage[];
        }) => i.input,
        agent_scratchpad: (i: {
          input: string;
          steps: AgentStep[];
          chat_history: BaseMessage[];
        }) => formatLogToString(i.steps),
        chat_history: (i: {
          input: string;
          steps: AgentStep[];
          chat_history: BaseMessage[];
        }) => i.chat_history,
      },
      promptWithInputs,
      modelWithStop,
      outputParser,
    ]);

    this.setMemory(user);
    const executor = AgentExecutor.fromAgentAndTools({
      agent: runnableAgent,
      tools,
      memory: this.memory,
    });
    //const asb= DynamicStructuredTool.
    const response = await executor.call({
      input,
    });
    this.userHistory.set(user, this.memory);
    return response.output;
  }
}

export const CharlesBotProvider: Provider = {
  provide: CharlesBot,
  useClass: CharlesBot,
};
