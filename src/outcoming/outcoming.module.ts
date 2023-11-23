import { Module } from '@nestjs/common';
import { OutcomingController } from './outcoming.controller';
import { OutcomingService } from './outcoming.service';
import { HttpServiceConfig } from 'src/httpService.config';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpServiceConfig,
    }),
    OutcomingModule,
    ConfigModule,
  ],
  controllers: [OutcomingController],
  providers: [OutcomingService],
})
export class OutcomingModule {}
