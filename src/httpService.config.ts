import { Injectable } from '@nestjs/common';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

@Injectable()
export class HttpServiceConfig implements HttpModuleOptionsFactory {
  //Creates an instance of HttpModuleOptions everytime an http method is invoked and injects
  //the custom headers in the request.
  createHttpOptions(): HttpModuleOptions {
    return {
      headers: {
        Authorization: `Bearer `,
        'Content-Type': 'application/json',
      },
    };
  }
}
