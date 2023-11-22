import {
  Controller,
  Post,
  HttpStatus,
  Res,
  Body,
  Logger,
} from '@nestjs/common';
import { TestService } from './test.service';
import { WhatsappCloudAPIRequest } from './dto/whatsappRequest.dto';

@Controller('test')
export class TestController {
  private readonly logger = new Logger('test');
  constructor(private readonly testService: TestService) {}

  @Post()
  testMessage(@Body() request: WhatsappCloudAPIRequest, @Res() response) {
    this.logger.warn('testMessage');
    console.log(process.env.WHATSAPP_BEARER_TOKEN);
    this.testService
      .testMessage(request)
      .then((res) => response.status(HttpStatus.CREATED).json(res))
      .catch((err) => {
        //console.log(err);
        return response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }
}
