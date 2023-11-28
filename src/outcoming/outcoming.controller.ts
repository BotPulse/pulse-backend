import { Controller, Post, HttpStatus, Res, Body } from '@nestjs/common';
import { OutcomingService } from './outcoming.service';
import { WhatsappRequestMessage } from './dto/whatsappRequestMessage.dto';

@Controller('outcoming')
export class OutcomingController {
  constructor(private readonly outcomingMessageService: OutcomingService) {}

  @Post()
  outcomingMessage(@Body() request: WhatsappRequestMessage, @Res() response) {
    this.outcomingMessageService
      .OutcomingMessage(request)
      .then((res) => response.status(HttpStatus.CREATED).json(res))
      .catch((err) => {
        return response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }
}
