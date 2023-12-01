import { Module } from '@nestjs/common';
import { IncomingService } from './incoming.service';
import { IncomingController } from './incoming.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HttpServiceConfig } from '../httpService.config';
import { OutcomingModule } from 'src/outcoming/outcoming.module';
import { OutcomingService } from 'src/outcoming/outcoming.service';
import { IncomingStrategyService } from './strategies/incoming-strategy.service';
import { OpenAIChat } from './chains/main-chain';
import { UnknownPayloadStrategy } from './strategies/unknown-message.service';
import { TextMessageStrategyProvider } from './strategies/text-message.strategy';
import { MessageStatusStrategyProvider } from './strategies/message-status.strategy';
import { StrategiesMapProvider } from './strategies/strategies-map.provider';
@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpServiceConfig,
    }),
    OutcomingModule,
    ConfigModule,
    IncomingModule,
  ],
  providers: [
    IncomingService,
    OutcomingService,
    IncomingStrategyService,
    UnknownPayloadStrategy,
    MessageStatusStrategyProvider,
    TextMessageStrategyProvider,
    OpenAIChat,
    StrategiesMapProvider,
  ],
  controllers: [IncomingController],
})
export class IncomingModule {}
