import { Injectable } from '@nestjs/common';
import { WebhookPayload } from './interfaces/webhook-payload';
import { ValueKeys } from './interfaces/webhook-payload';
import {
  IncomingRequestStrategyContext,
  getStrategy,
} from './incoming-strategy';
@Injectable()
export class IncomingService {
  public processRequest(requestBody: WebhookPayload) {
    const value = requestBody.entry[0].changes[0].value;
    if (value.hasOwnProperty(ValueKeys.MESSAGES)) {
      const type = value.messages[0].type;
      const context = new IncomingRequestStrategyContext(getStrategy(type));
      context.handleRequest(requestBody);
    } else if (value.hasOwnProperty(ValueKeys.STATUSES)) {
      const context = new IncomingRequestStrategyContext(
        getStrategy(ValueKeys.STATUSES),
      );
      context.handleRequest(requestBody);
    }
  }
}
