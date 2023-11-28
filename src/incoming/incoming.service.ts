import { Injectable } from '@nestjs/common';
import { WebhookPayload } from './dto/webhook-payload';
import {
  IncomingRequestStrategyContext,
  getStrategy,
} from './strategies/incoming-strategy';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class IncomingService {
  constructor(private configService: ConfigService) {}

  public processRequest(requestBody: WebhookPayload) {
    const strategy = getStrategy(requestBody);
    const strategyContext = new IncomingRequestStrategyContext(strategy);
    strategyContext.handleRequest(requestBody);
  }
}
