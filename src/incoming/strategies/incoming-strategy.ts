import { WebhookPayload } from '../dto/webhook-payload';
import { TextMessageStrategy } from './text-message-strategy';
import { MessageStatusStrategy } from './message-status-strategy';
import { UnknownPayloadStrategy } from './unknown-payload-strategy';
import { ValueKeys } from '../dto/webhook-payload';

export interface IncomingWhatsappRequestStrategy {
  handleRequest(requestBody: WebhookPayload): WebhookPayload;
}

export enum IncomingWhatsappRequestStrategyType {
  TEXT = 'text',
  STATUS = 'status',
  UNKNOWN = 'unknown',
}

export class IncomingRequestStrategyContext {
  private strategy: IncomingWhatsappRequestStrategy;
  constructor(strategy: IncomingWhatsappRequestStrategy) {
    this.strategy = strategy;
  }
  public setStategy(strategy: IncomingWhatsappRequestStrategy) {
    this.strategy = strategy;
  }
  public handleRequest(requestBody: WebhookPayload) {
    return this.strategy.handleRequest(requestBody);
  }
}

export function getStrategy(requestBody: WebhookPayload) {
  const value = requestBody.entry[0].changes[0].value;

  const strategies = new Map<
    IncomingWhatsappRequestStrategyType,
    IncomingWhatsappRequestStrategy
  >([
    [IncomingWhatsappRequestStrategyType.TEXT, new TextMessageStrategy()],
    [IncomingWhatsappRequestStrategyType.STATUS, new MessageStatusStrategy()],
    [IncomingWhatsappRequestStrategyType.UNKNOWN, new UnknownPayloadStrategy()],
  ]);

  if (value.hasOwnProperty(ValueKeys.MESSAGES)) {
    const type = value.messages[0].type;
    const strategy = strategies.get(
      type as unknown as IncomingWhatsappRequestStrategyType,
    );
    return (
      strategy || strategies.get(IncomingWhatsappRequestStrategyType.UNKNOWN)
    );
  }

  if (value.hasOwnProperty(ValueKeys.STATUSES)) {
    return strategies.get(IncomingWhatsappRequestStrategyType.STATUS);
  }

  return strategies.get(IncomingWhatsappRequestStrategyType.UNKNOWN);
}
