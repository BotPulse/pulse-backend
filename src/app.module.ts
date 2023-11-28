import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OutcomingModule } from './outcoming/outcoming.module';
import { IncomingModule } from './incoming/incoming.module';
import { StrategiesModule } from './incoming/strategies/strategies.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OutcomingModule,
    IncomingModule,
    StrategiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
