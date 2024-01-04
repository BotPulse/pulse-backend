import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppointmentDocument = Appoinments & Document;

@Schema()
export class Appoinments {
  @Prop()
  contact_email: string;

  @Prop()
  contact_name: string;

  @Prop()
  contact_phone: string;
}

export const AppointmentsSchema = SchemaFactory.createForClass(Appoinments);
