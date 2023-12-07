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
    private readonly configService: ConfigService,
    private httpservice: HttpService,
  ) {}
  private readonly baseUrl =
    this.configService.get<string>('WHATSAPP_BASE_URL');
  async OutcomingMessage(
    request: WhatsappRequestMessage | CustomWhatsappAnswer,
  ): Promise<WhatsappCloudAPIResponse> {
    const number = request.from;
    const url = this.whatsappUrlProvider.get(number);
    const response = await firstValueFrom(
      this.httpservice.post<WhatsappCloudAPIResponse>(url, request),
    );
    return response.data;
  }
}
