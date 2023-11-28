import { WebhookPayload } from '../dto/webhook-payload';
import { IncomingWhatsappRequestStrategy } from './incoming-strategy';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { OutcomingService } from 'src/outcoming/outcoming.service';

@Injectable()
export class TextMessageStrategy implements IncomingWhatsappRequestStrategy {
  constructor(
    private readonly configService: ConfigService,
    private outcomingService: OutcomingService,
  ) {}
  private async getAnswer(input: string): Promise<string> {
    const openAIApiKey = this.configService.get<string>('OPENAI_API_KEY');
    const model = new ChatOpenAI({
      temperature: 0,
      openAIApiKey,
    });
    //     const systemPromptTemplate = `eres un asistente virtual llamado Andres,
    // que se encarga de dar nombres de personas, no sabes hacer otra cosa y no
    // respondas otro tipo de preguntas`;
    const systemPromptTemplate = `Transforma el siguiente texto, 
que contiene expresiones ofensivas, en una versión más respetuosa y cortés:
`;
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
    const response = await chain.call({
      input,
    });
    return response?.response;
  }

  async handleRequest(requestBody: WebhookPayload) {
    const value = requestBody.entry[0].changes[0].value;
    const body = value.messages[0].text.body;
    const from = value.messages[0].from;
    const baseUrl = this.configService.get<string>('WHATSAPP_BASE_URL');
    const token = this.configService.get<string>('WHATSAPP_BEARER_TOKEN');
    console.log(`Incoming message from ${from}: ${body}`);
    const AIresponse = await this.getAnswer(body);
    //const httpservice = new HttpService();
    const response = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: from,
      type: 'text',
      text: {
        preview_url: false,
        body: AIresponse,
      },
    };
    fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    });
    //await this.outcomingService.OutcomingMessage(response);
    console.log(AIresponse);
    return 'ok';
  }
}
