import {
  Controller,
  Post,
  HttpStatus,
  Res,
  Body,
  Logger,
} from '@nestjs/common';
import { OutcomingService } from './outcoming.service';
import { WhatsappCloudAPIRequest } from './dto/whatsappRequest.dto';

@Controller('outcoming')
export class OutcomingController {
  private readonly logger = new Logger('test');
  constructor(private readonly outcomingMessageService: OutcomingService) {}

  @Post()
  outcomingMessage(@Body() request: WhatsappCloudAPIRequest, @Res() response) {
    this.logger.warn('OutcomingMessage');
    this.outcomingMessageService
      .OutcomingMessage(request)
      .then((res) => response.status(HttpStatus.CREATED).json(res))
      .catch((err) => {
        return response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }
}
