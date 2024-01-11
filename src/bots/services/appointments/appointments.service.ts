import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Appoinments } from './schemas/appointment.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appoinments.name)
    private appointmentsModel: Model<Appoinments>,
  ) {}
  async createAppointment(appointmentData: any): Promise<string> {
    const createdAppointment = new this.appointmentsModel(appointmentData);
    const result = await createdAppointment.save();
    return result.id;
  }
}
