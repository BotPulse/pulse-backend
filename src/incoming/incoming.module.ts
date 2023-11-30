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
import { TextMessageStrategy } from './strategies/text-message.strategy';
import { MessageStatusStrategy } from './strategies/message-status.strategy';

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
    TextMessageStrategy,
    MessageStatusStrategy,
    OpenAIChat,
  ],
  controllers: [IncomingController],
})
export class IncomingModule {}
