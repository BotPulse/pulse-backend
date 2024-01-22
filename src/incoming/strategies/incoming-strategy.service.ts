import { WebhookPayload } from '../dto/webhook-payload.dto';
import { Injectable } from '@nestjs/common';
import { IncomingWhatsappRequestStrategy } from './strategy-interfaces';

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
