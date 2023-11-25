import { WebhookPayload } from './interfaces/webhook-payload';

interface IncomingWhatsappRequestStrategy {
  handleRequest(requestBody: WebhookPayload): WebhookPayload;
}

// TODO: definir DTO para el body de la peticion en cada estrategia concreta
export class TextMessageStrategy implements IncomingWhatsappRequestStrategy {
  handleRequest(requestBody: WebhookPayload): WebhookPayload {
    const value = requestBody.entry[0].changes[0].value;
    const body = value.messages[0].text.body;
    const from = value.messages[0].from;
    console.log(`Incoming message from ${from}: ${body}`);
    return requestBody;
  }
}

export class StatusMessageStrategy implements IncomingWhatsappRequestStrategy {
  handleRequest(requestBody: WebhookPayload): WebhookPayload {
    const value = requestBody.entry[0].changes[0].value;
    const status = value.statuses[0].status;
    const from = value.statuses[0].recipient_id;
    console.log(`Message status from ${from}: ${status}`);
    return requestBody;
  }
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

export function getStrategy(strategy: string): IncomingWhatsappRequestStrategy {
  const strategies = {
    text: new TextMessageStrategy(),
    statuses: new StatusMessageStrategy(),
  };
  return strategies[strategy];
}
