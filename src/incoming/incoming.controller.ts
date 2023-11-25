import { Controller, Post, Req, Get, Body } from '@nestjs/common';
import { Request } from 'express';
import { IncomingMessage } from './dto/IncomingMessage.dto';
import { IncomingService } from './incoming.service';
@Controller('incoming')
export class IncomingController {

  constructor(private readonly incomingService: IncomingService) {}
  @Get()
  async returnConfig(@Req() request: Request) {
    const challenge = request.query['hub.challenge'];
    return challenge;
  }

  @Post()
  async webhook(@Body() body: IncomingMessage) {
    this.incomingService.processRequest(body);

    return 'ok';
  }
}
