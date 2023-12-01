import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
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
  ): Promise<WhatsappCloudAPIResponse> {
    const response = await firstValueFrom(
      this.httpservice.post<WhatsappCloudAPIResponse>(this.baseUrl, request),
    );
    return response.data;
  }
}
