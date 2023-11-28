import { Controller, Post, Req, Get, Body, Logger } from '@nestjs/common';
import { Request } from 'express';
import { WebhookPayload } from './dto/webhook-payload';
import { IncomingService } from './incoming.service';
@Controller('incoming')
export class IncomingController {
  private readonly logger = new Logger('IncomingController')
  constructor(private readonly incomingService: IncomingService) {}
  @Get()
  async returnConfig(@Req() request: Request) {
    const challenge = request.query['hub.challenge'];
    this.logger.warn(`Verification code is ${challenge}`);
    return challenge;
  }

  @Post()
  async webhook(@Body() body: WebhookPayload) {
    this.incomingService.processRequest(body);
    return 'ok';
  }
}
