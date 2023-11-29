import { Injectable } from '@nestjs/common';
import { WebhookPayload } from './dto/webhook-payload';
import { ConfigService } from '@nestjs/config';
import { OutcomingService } from 'src/outcoming/outcoming.service';
@Injectable()
export class IncomingService {
  constructor(
    private configService: ConfigService,
    private outcomingService: OutcomingService,
  ) {}
  public processMessage(body: WebhookPayload) {
    //TODO: recrear el getStrategy aqui, luego, eliminar el outcoming
    //service de textMessageStrategy y definir el return de las strategias,
    //al final, enviar el return de las strategias a outcomingService
    //this.outcomingService.OutcomingMessage();
    return 'ok';
  }
}
