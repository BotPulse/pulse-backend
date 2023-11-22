import { Injectable } from '@nestjs/common';
import { BASE_URL } from '../common/apiResource';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { WhatsappCloudAPIRequest } from './dto/whatsappRequest.dto';
import { WhatsappCloudAPIResponse } from './dto/whatsappResponse.dto';

@Injectable()
export class TestService {
  constructor(private httpservice: HttpService) {}
  baseUrl = BASE_URL;
  async testMessage(
    request: WhatsappCloudAPIRequest,
  ): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    const { data } = await firstValueFrom(
      this.httpservice.post(this.baseUrl, request),
    );
    console.log(data);
    return data;
  }
}
