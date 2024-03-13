import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { AlfredBot } from './alfred.bot';
import { CharlesBot } from './charles.bot';
import { BotFactory } from './bot-factory.bot';
import { EchoBot } from './echo.bot';
import { ConfigModule } from '@nestjs/config';
import { BotProvider } from './bot-provider';
import { BotSaveAppointment } from './tools/bot-save-email.tool';
import { AppointmentsService } from './services/appointments/appointments.service';
import { Appoinments } from './services/appointments/schemas/appointment.schema';
import { AppointmentsSchema } from './services/appointments/schemas/appointment.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Appoinments.name,
        schema: AppointmentsSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [
    BotsService,
    AlfredBot,
    CharlesBot,
    EchoBot,
    BotProvider,
    BotFactory,
    AppointmentsService,
    BotSaveAppointment,
  ],
  exports: [
    BotsService,
    AlfredBot,
    CharlesBot,
    EchoBot,
    BotProvider,
    BotFactory,
    AppointmentsService,
    BotSaveAppointment,
  ],
})
export class BotsModule {}
