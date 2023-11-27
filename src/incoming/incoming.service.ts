import { Injectable } from '@nestjs/common';
import { WebhookPayload } from './dto/webhook-payload';
import {
  IncomingRequestStrategyContext,
  getStrategy,
} from './strategies/incoming-strategy';
@Injectable()
export class IncomingService {
  public processRequest(requestBody: WebhookPayload) {
    const strategy = getStrategy(requestBody);
    const strategyContext = new IncomingRequestStrategyContext(strategy);
    strategyContext.handleRequest(requestBody);
  }
}
