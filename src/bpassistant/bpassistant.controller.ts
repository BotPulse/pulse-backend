import { Controller, Post, Req, Get, Body, Logger } from '@nestjs/common';
import { Request } from 'express';
import { WebhookPayload } from 'src/incoming/dto/webhook-payload.dto';
import { BpassistantService } from './bpassistant.service';

@Controller('bpassistant')
export class BpassistantController {
  private readonly logger = new Logger(BpassistantController.name);
  constructor(private readonly bpassitantService: BpassistantService) {}

  getChallenge(request: Request) {
    const challenge = request.query['hub.challenge'];
    this.logger.warn(`Verification code is ${challenge}`);
    return challenge;
  }

  @Get()
  async returnConfig(@Req() request: Request) {
    return this.getChallenge(request);
  }

  @Post()
  async webhook(@Body() body: WebhookPayload) {
    this.bpassitantService.processMessage(body);
    return 'ok';
  }
}
