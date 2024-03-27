import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WhatsappCloudAPIResponse } from './dto/whatsappResponse.dto';
import { WhatsappRequestMessage } from './dto/whatsappRequestMessage.dto';
import { CustomWhatsappAnswer } from './dto/custom-response.dto';
@Injectable()
export class OutcomingService {
  constructor(
    @Inject('WhatsappUrlMap')
    private readonly whatsappUrlProvider: Map<string, string>,
    private httpService: HttpService,
  ) {}
  private maxCharacters = 4000;
  splitMessage(message: string) {
    const chunks: string[] = [];
    const words = message.split(' ');
    let newMessage = '';
    words.forEach((word: string) => {
      if (newMessage.length + word.length + 1 > this.maxCharacters) {
        chunks.push(newMessage.trim());
        console.log(`message lenght: ${newMessage.length}`);
        newMessage = word + ' ';
      } else {
        newMessage += word + ' ';
      }
    });
    chunks.push(newMessage.trim());
    chunks.forEach((chunk, index) => {
      console.log(`chunk #${index} length: ${chunk.length}`);
    });
    return chunks;
  }

  sendMultipleRequests(
    request: WhatsappRequestMessage,
    id: string,
  ): Observable<any[]> {
    const url = this.whatsappUrlProvider.get(id);
    const message = request.text.body;
    const chunks = this.splitMessage(message);
    const messages = chunks.map((chunk: string) => {
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: request.to,
        type: request.type,
        text: {
          preview_url: false,
          body: chunk,
        },
      };
    });
    const observables = messages.map((message) => {
      return this.httpService
        .post<WhatsappCloudAPIResponse>(url, message)
        .pipe(map((response) => response.data));
    });
    return forkJoin(observables);
  }
  async sendSingleRequest(
    request: WhatsappRequestMessage,
    id: string,
  ): Promise<any> {
    const url = this.whatsappUrlProvider.get(id);
    const newResponse = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: request.to,
      type: request.type,
      text: {
        preview_url: false,
        body: request.text.body,
      },
    };
    const response = await firstValueFrom(
      this.httpService.post<WhatsappCloudAPIResponse>(url, newResponse),
    );
    return response;
  }

  async OutcomingTranscriptionMessage(
    request: WhatsappRequestMessage | CustomWhatsappAnswer,
    id: string,
  ): Promise<WhatsappCloudAPIResponse> {
    const message = request.text.body;
    if (message.length < this.maxCharacters) {
      const response = await this.sendSingleRequest(request, id);
      return response.data;
    } else {
      await lastValueFrom(this.sendMultipleRequests(request, id));
    }
  }

  async OutcomingMessage(
    request: WhatsappRequestMessage | CustomWhatsappAnswer,
    id: string,
  ): Promise<WhatsappCloudAPIResponse> {
    const url = this.whatsappUrlProvider.get(id);
    const newResponse = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: request.to,
      type: request.type,
      text: {
        preview_url: false,
        body: request.text.body,
      },
    };
    const response = await firstValueFrom(
      this.httpService.post<WhatsappCloudAPIResponse>(url, newResponse),
    );
    return response.data;
  }
}
