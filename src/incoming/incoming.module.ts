import { Module } from '@nestjs/common';
import { IncomingService } from './incoming.service';
//import { IncomingController } from './incoming.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HttpServiceConfig } from '../httpService.config';
import { OutcomingModule } from 'src/outcoming/outcoming.module';
import { IncomingStrategyService } from './strategies/incoming-strategy.service';
import { UnknownPayloadStrategyProvider } from './strategies/unknown-message.service';
import { TextMessageStrategyProvider } from './strategies/text-message.strategy';
import { MessageStatusStrategyProvider } from './strategies/message-status.strategy';
import { AudioMessageStrategy } from './strategies/audio-message.strategy';
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
import {
  Appoinments,
  AppointmentsSchema,
} from 'src/bots/services/appointments/schemas/appointment.schema';
import { MessageStrategy } from './strategies/message.strategy';
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
    ]),
    OutcomingModule,
    ConfigModule,
    ConversationsModule,
    IncomingModule,
    BotsModule,
  ],
  providers: [
    IncomingStrategyService,
    TextMessageStrategyProvider,
    AudioMessageStrategy,
    UnknownPayloadStrategyProvider,
    MessageStatusStrategyProvider,
    //StrategiesMapProvider,
    ConversationsService,
    StatusesService,
    MessageStrategy,
  ],
  controllers: [],
  exports: [
    //IncomingService,
    IncomingStrategyService,
    TextMessageStrategyProvider,
    AudioMessageStrategy,
    UnknownPayloadStrategyProvider,
    MessageStatusStrategyProvider,
    //StrategiesMapProvider,
    ConversationsService,
    StatusesService,
    MessageStrategy,
  ],
})
export class IncomingModule {}
