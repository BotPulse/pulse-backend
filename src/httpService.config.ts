import { Injectable } from '@nestjs/common';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class HttpServiceConfig implements HttpModuleOptionsFactory {
  
  constructor(private configService: ConfigService) {}
  private readonly whatsAppToken = this.configService.get<string>(
    'WHATSAPP_BEARER_TOKEN',
  );
  //Creates an instance of HttpModuleOptions everytime an http method is invoked and injects
  //the custom headers in the request.
  createHttpOptions(): HttpModuleOptions {
    return {
      headers: {
        Authorization: `Bearer ${this.whatsAppToken}`,
        'Content-Type': 'application/json',
      },
    };
  }
}
