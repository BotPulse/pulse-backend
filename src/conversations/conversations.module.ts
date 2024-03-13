import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversations.schema';
import { Status, StatusesSchema } from './schemas/statuses.schema';
import {
  AuthNumbers,
  AuthNumbersSchema,
} from './schemas/authorized-numbers.schema';
import { AuthNumbersService } from './auth-numbers/auth-numbers.service';
import { MessagesService } from './messages/messages.service';
import { StatusesService } from './statuses/statuses.service';

@Module({
  imports: [
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
        name: AuthNumbers.name,
        schema: AuthNumbersSchema,
      },
    ]),
  ],
  providers: [
    ConversationsService,
    MessagesService,
    StatusesService,
    AuthNumbersService,
  ],
  exports: [ConversationsService, AuthNumbersService],
})
export class ConversationsModule {}
