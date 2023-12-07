import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WhatsappCloudAPIResponse } from './dto/whatsappResponse.dto';
import { WhatsappRequestMessage } from './dto/whatsappRequestMessage.dto';
import { CustomWhatsappAnswer } from './dto/custom-response.dto';
import { ConfigService } from '@nestjs/config';
//import { WhatsappUrlProvider } from './whatsapp-url.provider';
@Injectable()
export class OutcomingService {
  constructor(
    @Inject('WhatsappUrlMap')
    private readonly whatsappUrlProvider: Map<string, string>,
    private httpservice: HttpService,
  ) {}
  async OutcomingMessage(
    request: WhatsappRequestMessage | CustomWhatsappAnswer,
    id: string,
  ): Promise<WhatsappCloudAPIResponse> {
    const url = this.whatsappUrlProvider.get(id);
    console.log(id);
    console.log(url);
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
      this.httpservice.post<WhatsappCloudAPIResponse>(url, newResponse),
    );
    return response.data;
  }
}
