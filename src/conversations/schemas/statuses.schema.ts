import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatusesDocument = Status & Document;

export enum MessageStatusEnum {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  CREATED = 'created',
  NONE = 'none',
  RECIEVED = 'recieved',
}

@Schema()
export class Status {
  @Prop()
  id: string;
  @Prop()
  status: string;
  @Prop()
  timestamp: number;
  @Prop()
  recipient_id: string;
}

export const StatusesSchema = SchemaFactory.createForClass(Status);
