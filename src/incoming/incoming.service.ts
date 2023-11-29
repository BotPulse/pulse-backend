import { Injectable } from '@nestjs/common';
import { WebhookPayload } from './dto/webhook-payload';
import { ConfigService } from '@nestjs/config';
import { OutcomingService } from 'src/outcoming/outcoming.service';
import { IncomingStrategyService } from './incoming-strategy.service';
import { UnknownPayloadStrategy } from './unknown-message.service';
@Injectable()
export class IncomingService {
  constructor(
    private incomingStrategyService: IncomingStrategyService,
    private outcomingService: OutcomingService,
  ) {}
  public processMessage(body: WebhookPayload) {
    //TODO: recrear el getStrategy aqui, luego, eliminar el outcoming
    //service de textMessageStrategy y definir el return de las strategias,
    //al final, enviar el return de las strategias a outcomingService
    //this.outcomingService.OutcomingMessage();
    this.incomingStrategyService.setStategy(new UnknownPayloadStrategy());
    const response = this.incomingStrategyService.handleRequest(body);
    this.outcomingService.OutcomingMessage(response);

    return 'ok';
  }
}
