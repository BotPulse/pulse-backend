import { WebhookPayload } from './dto/webhook-payload';
import { Injectable } from '@nestjs/common';
import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';
// import { ValueKeys } from './dto/webhook-payload';
// import { ConfigService } from '@nestjs/config';
// import { OutcomingService } from 'src/outcoming/outcoming.service';
// import { HttpService } from '@nestjs/axios';
@Injectable()
export class IncomingStrategyService {
  private strategy: IncomingWhatsappRequestStrategy;
  constructor() {}
  public setStategy(strategy: IncomingWhatsappRequestStrategy) {
    this.strategy = strategy;
  }
  public handleRequest(requestBody: WebhookPayload) {
    return this.strategy.handleRequest(requestBody);
  }
}
