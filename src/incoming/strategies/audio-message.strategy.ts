import { Injectable } from '@nestjs/common';
import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
import { Logger } from '@nestjs/common';
import { WebhookPayload } from '../dto/webhook-payload.dto';
import { OutcomingService } from 'src/outcoming/outcoming.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import * as path from 'path';
import { OpenAIWhisperAudio } from 'langchain/document_loaders/fs/openai_whisper_audio';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AudioMessageStrategy implements IncomingWhatsappRequestStrategy {
  constructor(
    private readonly outcomingService: OutcomingService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}
  private logger = new Logger('AudioMessageStrategy');

  async downloadFile(url: string, fileName: string) {
    const tempFilePath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'temp',
      `${fileName}.ogg`,
    );
    try {
      const downloadAudio = await firstValueFrom(
        this.httpService.get(url, {
          responseType: 'stream',
        }),
      );
      const writer = fs.createWriteStream(tempFilePath);

      downloadAudio.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(tempFilePath));
        writer.on('error', reject);
      });
    } catch (error) {
      throw new Error('Error downloading file');
    }
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
    this.logger.log('Audio message received');
    const value = requestBody.entry[0].changes[0].value;
    const audioId = value.messages[0].audio.id;
    const displayPhoneNumber = value.metadata.display_phone_number;
    const getAudioURL = `${this.configService.get<string>(
      'META_MEDIA_URL',
    )}${audioId}/`;
    const audioUrl = await firstValueFrom(this.httpService.get(getAudioURL));
    const downloadURL = audioUrl.data.url;
    await this.downloadFile(downloadURL, audioId);
    const tempFilePath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'temp',
      `${audioId}.ogg`,
    );
    const speechToText = await this.submitAudio(tempFilePath);
    const text = speechToText[0].pageContent;
    const formattedText = `🔊: ${text}
    
*Disclaimer: No almacenamos datos de tus audios ni textos generados de los mismos.*
    `;
    this.logger.log(text);
    const response = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: value.messages[0].from,
      from: requestBody.entry[0].id,
      type: 'text',
      text: {
        preview_url: false,
        body: formattedText,
      },
    };
    this.outcomingService.OutcomingMessage(response, displayPhoneNumber);
    this.deleteFile(tempFilePath);
    return requestBody;
  }
}
