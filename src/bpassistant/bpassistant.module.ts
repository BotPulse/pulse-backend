import { Module } from '@nestjs/common';
import { BpassistantService } from './bpassistant.service';
import { BpassistantController } from './bpassistant.controller';
import { StrategiesProvider } from './providers/strategies-provider';
import { StatusesService } from 'src/conversations/statuses/statuses.service';
import { HttpModule } from '@nestjs/axios';
import { HttpServiceConfig } from 'src/httpService.config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConversationSchema,
  Conversation,
} from 'src/conversations/schemas/conversations.schema';
import {
  Status,
  StatusesSchema,
} from 'src/conversations/schemas/statuses.schema';
import { IncomingModule } from 'src/incoming/incoming.module';
import { OutcomingModule } from 'src/outcoming/outcoming.module';
import { BpassistantMessageStrategy } from './providers/bpassistant.message.strategy';
import { ConversationsModule } from 'src/conversations/conversations.module';
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
    ConversationsModule,
    IncomingModule,
    ConfigModule,
    OutcomingModule,
  ],
  providers: [
    BpassistantService,
    StrategiesProvider,
    StatusesService,
    BpassistantMessageStrategy,
  ],
  controllers: [BpassistantController],
})
export class BpassistantModule {}
