import { Injectable, Provider } from '@nestjs/common';
import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { Logger } from '@nestjs/common';
import { WebhookPayload } from '../dto/webhook-payload.dto';
import { OutcomingService } from 'src/outcoming/outcoming.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import * as path from 'path';
import { OpenAIWhisperAudio } from 'langchain/document_loaders/fs/openai_whisper_audio';

@Injectable()
export class AudioMessageStrategy implements IncomingWhatsappRequestStrategy {
  constructor(
    private readonly outcomingService: OutcomingService,
    private configService: ConfigService,
  ) {}
  private logger = new Logger('AudioMessageStrategy');

  async downloadFile(url: string, fileName: string) {
    const downloadAudio = await axios.get(url, {
      responseType: 'stream',

      headers: {
        Authorization: `Bearer ${this.configService.get<string>(
          'WHATSAPP_BEARER_TOKEN',
        )}`,
      },
    });
    const tempFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'temp',
      `${fileName}.ogg`,
    );
    const writer = fs.createWriteStream(tempFilePath);

    downloadAudio.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(tempFilePath));
      writer.on('error', reject);
    });
  }

  async submitAudio(audioPath: string): Promise<any> {
    const loader = new OpenAIWhisperAudio(audioPath);
    const docs = await loader.load();
    return docs;
  }
  deleteFile(filePath: string) {
    fs.removeSync(filePath);
  }
  async handleRequest(requestBody: WebhookPayload): Promise<any> {
    const value = requestBody.entry[0].changes[0].value;
    const audioId = value.messages[0].audio.id;
    const displayPhoneNumber = value.metadata.display_phone_number;
    const getAudioURL = `https://graph.facebook.com/v19.0/${audioId}/`;
    const audioUrl = await axios.get(getAudioURL, {
      headers: {
        Authorization: `Bearer ${this.configService.get<string>(
          'WHATSAPP_BEARER_TOKEN',
        )}`,
      },
    });
    const downloadURL = audioUrl.data.url;

    await this.downloadFile(downloadURL, audioId);

    const tempFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'temp',
      `${audioId}.ogg`,
    );
    const speechToText = await this.submitAudio(tempFilePath);
    const text = speechToText[0].pageContent;
    const response = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: value.messages[0].from,
      from: requestBody.entry[0].id,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    };
    this.outcomingService.OutcomingMessage(response, displayPhoneNumber);
    this.deleteFile(tempFilePath);
    return requestBody;
  }
}

export const AudioMessageStrategyProvider: Provider = {
  provide: AudioMessageStrategy,
  useClass: AudioMessageStrategy,
};
