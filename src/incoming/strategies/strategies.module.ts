import { Module } from '@nestjs/common';
import { TextMessageStrategy } from './text-message-strategy';
import { HttpModule } from '@nestjs/axios';
import { HttpServiceConfig } from '../../httpService.config';
import { ConfigModule } from '@nestjs/config';
import { OutcomingService } from 'src/outcoming/outcoming.service';
import { OutcomingModule } from 'src/outcoming/outcoming.module';
import { IncomingRequestStrategyContext } from './incoming-strategy';
import { IncomingModule } from '../incoming.module';
@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpServiceConfig,
    }),
    ConfigModule,
    OutcomingModule,
  ],
  providers: [
    TextMessageStrategy,
    OutcomingService,
    IncomingRequestStrategyContext,
  ],
})
export class StrategiesModule {}
