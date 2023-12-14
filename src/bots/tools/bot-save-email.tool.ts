import { DynamicStructuredTool } from 'langchain/tools';
import { Injectable } from '@nestjs/common';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { z } from 'zod';
@Injectable()
export class BotSaveAppointment {
  private AppointmentId: string;
  constructor(private appointmentsService: AppointmentsService) {}
  private setAppointmentId(AppointmentId: string) {
    this.AppointmentId = AppointmentId;
  }

  private getAppointmentId() {
    return this.AppointmentId;
  }

  public saveEmailAppointment(): DynamicStructuredTool {
    const tool = new DynamicStructuredTool({
      name: 'saveAppointment',
      description: `call this to save the email, name and phone of the user in the database`,
      schema: z.object({
        contact_email: z.string().describe("the user's email"),
        contact_name: z.string().describe("the user's name"),
        contact_phone: z.string().describe("the user's phone number"),
      }),
      func: async ({
        contact_email,
        contact_name,
        contact_phone,
      }): Promise<string> => {
        const result = await this.appointmentsService.createAppointment({
          contact_email,
          contact_name,
          contact_phone,
        });
        return result;
      },
    });
    return tool;
  }
}
