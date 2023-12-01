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

  async updateConversation(
    conversationId: string,
    updateConversation: CreateConversationDto,
  ): Promise<Conversation> {
    return this.conversationModel
      .findOneAndUpdate({ _id: conversationId }, updateConversation, {
        new: true,
      })
      .exec();
  }

  async createOrUpdate(
    conversation: CreateConversationDto,
  ): Promise<Conversation> {
    const existingConversation = await this.conversationModel.findOne({
      _id: conversation._id,
    });
    if (existingConversation) {
      existingConversation.messages.push(...conversation.messages);
      return existingConversation.save();
    } else {
      const createConversation = new this.conversationModel(conversation);
      await createConversation.save();
    }
  }
}
