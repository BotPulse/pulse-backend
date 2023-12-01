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
import { UnknownPayloadStrategyProvider } from './strategies/unknown-message.service';
import { TextMessageStrategyProvider } from './strategies/text-message.strategy';
import { MessageStatusStrategyProvider } from './strategies/message-status.strategy';
import { StrategiesMapProvider } from './strategies/strategies-map.provider';
import { ConversationsService } from 'src/conversations/conversations.service';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConversationSchema,
  Conversation,
} from 'src/conversations/schemas/conversations.schema';
@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpServiceConfig,
    }),
    MongooseModule.forFeature([
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
    ]),
    OutcomingModule,
    ConfigModule,
    ConversationsModule,
    IncomingModule,
  ],
  providers: [
    IncomingService,
    OutcomingService,
    IncomingStrategyService,
    UnknownPayloadStrategyProvider,
    MessageStatusStrategyProvider,
    TextMessageStrategyProvider,
    OpenAIChat,
    StrategiesMapProvider,
    ConversationsService,
  ],
  controllers: [IncomingController],
})
export class IncomingModule {}
