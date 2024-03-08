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
import { AudioMessageStrategyProvider } from './strategies/audio-message.strategy';
import { StrategiesMapProvider } from './strategies/strategies-map.provider';
import { ConversationsService } from 'src/conversations/conversations.service';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConversationSchema,
  Conversation,
} from 'src/conversations/schemas/conversations.schema';
import {
  Status,
  StatusesSchema,
} from 'src/conversations/schemas/statuses.schema';
import { StatusesService } from 'src/conversations/statuses/statuses.service';
import { BotsModule } from 'src/bots/bots.module';
import { BotsService } from 'src/bots/bots.service';
import { BotFactory } from 'src/bots/bot-factory.bot';
import { BotProvider } from 'src/bots/bot-provider';
import { AlfredBot } from 'src/bots/alfred.bot';
import { CharlesBot } from 'src/bots/charles.bot';
import { EchoBot } from 'src/bots/echo.bot';
import {
  Appoinments,
  AppointmentsSchema,
} from 'src/bots/services/appointments/schemas/appointment.schema';
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
      {
        name: Status.name,
        schema: StatusesSchema,
      },
      {
        name: Appoinments.name,
        schema: AppointmentsSchema,
      },
    ]),
    OutcomingModule,
    ConfigModule,
    ConversationsModule,
    IncomingModule,
    BotsModule,
  ],
  providers: [
    IncomingService,
    OutcomingService,
    IncomingStrategyService,
    TextMessageStrategyProvider,
    AudioMessageStrategyProvider,
    UnknownPayloadStrategyProvider,
    MessageStatusStrategyProvider,
    OpenAIChat,
    StrategiesMapProvider,
    ConversationsService,
    StatusesService,
    BotsService,
    BotFactory,
    BotProvider,
    AlfredBot,
    CharlesBot,
    EchoBot,
  ],
  controllers: [IncomingController],
})
export class IncomingModule {}
