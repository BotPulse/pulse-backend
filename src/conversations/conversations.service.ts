import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './schemas/conversations.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async createConversation(
    createConversation: CreateConversationDto,
  ): Promise<Conversation> {
    const createdConversation = new this.conversationModel(createConversation);
    return createdConversation.save();
  }
}
