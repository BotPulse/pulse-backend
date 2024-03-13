import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthNumbersDocument = AuthNumbers & Document;

@Schema()
export class AuthNumbers {
  @Prop()
  id: string;
  @Prop()
  number: string;
  @Prop()
  name: number;
}

export const AuthNumbersSchema = SchemaFactory.createForClass(AuthNumbers);