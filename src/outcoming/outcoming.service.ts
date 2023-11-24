import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
//import { WhatsappCloudAPIRequest } from './dto/whatsappRequest.dto';
import { WhatsappCloudAPIResponse } from './dto/whatsappResponse.dto';
import { WhatsappRequestMessage } from './dto/whatsappRequestMessage.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OutcomingService {
  constructor(
    private configService: ConfigService,
    private httpservice: HttpService,
  ) {}
  private readonly baseUrl =
    this.configService.get<string>('WHATSAPP_BASE_URL');
  async OutcomingMessage(
    request: WhatsappRequestMessage,
  ): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    const { data } = await firstValueFrom(
      this.httpservice.post(this.baseUrl, request),
    );
    return data;
  }
}
