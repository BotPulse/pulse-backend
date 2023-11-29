import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { WhatsappCloudAPIResponse } from './dto/whatsappResponse.dto';
import { WhatsappRequestMessage } from './dto/whatsappRequestMessage.dto';
import { CustomWhatsappAnswer } from './dto/custom-response.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class OutcomingService {
  constructor(
    private readonly configService: ConfigService,
    private httpservice: HttpService,
  ) {}
  private readonly baseUrl =
    this.configService.get<string>('WHATSAPP_BASE_URL');
  async OutcomingMessage(
    request: WhatsappRequestMessage | CustomWhatsappAnswer,
  ): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    const { data } = await firstValueFrom(
      this.httpservice.post(this.baseUrl, request),
    );
    return data;
  }
}
