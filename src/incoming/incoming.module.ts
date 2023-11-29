import { Module } from '@nestjs/common';
import { IncomingService } from './incoming.service';
import { IncomingController } from './incoming.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HttpServiceConfig } from '../httpService.config';
import { OutcomingModule } from 'src/outcoming/outcoming.module';
import { OutcomingService } from 'src/outcoming/outcoming.service';
//import { IncomingRequestStrategyContext } from './incoming.strategy.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpServiceConfig,
    }),
    OutcomingModule,
    ConfigModule,
  ],
  providers: [IncomingService, OutcomingService],
  controllers: [IncomingController],
})
export class IncomingModule {}
