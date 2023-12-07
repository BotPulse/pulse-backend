import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;
@Schema()
export class Contact {
  @Prop()
  wa_id: string;

  @Prop()
  profile_name: string;
}

@Schema()
export class Message {
  @Prop()
  _id: string;

  @Prop()
  from: string;

  @Prop()
  timestamp: number;

  @Prop()
  text: string;

  @Prop()
  type: string;
}

@Schema()
export class Conversation {
  @Prop()
  from: string;

  @Prop()
  whatsapp_business_account_id: string;

  @Prop()
  display_phone_number: string;

  @Prop()
  phone_number_id: string;

  @Prop({ type: [Contact] })
  contacts: Contact[];

  @Prop({ type: [Message] })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
