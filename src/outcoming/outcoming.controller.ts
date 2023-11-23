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
  constructor(private readonly testService: OutcomingService) {}

  @Post()
  testMessage(@Body() request: WhatsappCloudAPIRequest, @Res() response) {
    this.logger.warn('testMessage');
    this.testService
      .OutcomingMessage(request)
      .then((res) => response.status(HttpStatus.CREATED).json(res))
      .catch((err) => {
        return response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }
}
