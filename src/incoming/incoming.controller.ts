import { Controller, Post, Req, Get, Body } from '@nestjs/common';
import { Request } from 'express';
import { IncomingMessage } from './dto/IncomingMessage.dto';
@Controller('incoming')
export class IncomingController {
  @Get()
  async returnConfig(@Req() request: Request) {
    const challenge = request.query['hub.challenge'];
    return challenge;
  }

  @Post()
  async webhook(@Body() body: IncomingMessage) {
    //console.debug(body?.entry.at(0).changes.at(0).value.statuses[0]);
    //console.log(request);
    //console.log(request.body.entry[0].changes[0].value.messages[0]);
    const message = body?.entry.at(0).changes.at(0).value.messages ?? undefined;
    const status = body?.entry.at(0).changes.at(0).value.statuses ?? undefined;
    if (message) {
      console.log(
        `Message received from ${message.at(0).from} : ${
          message.at(0).text.body
        } `,
      );
    } else if (status) {
      console.log(
        `Message Status to ${status[0].recipient_id} : status ${status[0].status} `,
      );
    }
    return 'ok';
  }
}
