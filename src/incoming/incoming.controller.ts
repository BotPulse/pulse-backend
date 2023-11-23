import { Controller, Post, Req, Get } from '@nestjs/common';
import { Request } from 'express';

@Controller('incoming')
export class IncomingController {
  @Get()
  async returnConfig(@Req() request: Request) {
    const challenge = request.query['hub.challenge'];
    return challenge;
  }

  @Post()
  async webhook(@Req() request: Request) {
    console.log(request.body.entry[0].changes[0].value.messages[0]);
    return 'ok';
  }
}
