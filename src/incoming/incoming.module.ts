import { Module } from '@nestjs/common';
import { IncomingService } from './incoming.service';
import { IncomingController } from './incoming.controller';

@Module({
  providers: [IncomingService],
  controllers: [IncomingController],
})
export class IncomingModule {}
