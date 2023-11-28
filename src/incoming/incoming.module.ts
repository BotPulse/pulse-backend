import { Module } from '@nestjs/common';
import { IncomingService } from './incoming.service';
import { IncomingController } from './incoming.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HttpServiceConfig } from '../httpService.config';
import { OutcomingModule } from 'src/outcoming/outcoming.module';
import { OutcomingService } from 'src/outcoming/outcoming.service';
import { IncomingRequestStrategyContext } from './strategies/incoming-strategy';
import { StrategyModule } from './strategy/strategy.module';
import { StrategiesModule } from './strategies/strategies.module';
@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpServiceConfig,
    }),
    ConfigModule,
    IncomingModule,
    OutcomingModule,
    StrategyModule,
    StrategiesModule,
  ],
  providers: [
    IncomingService,
    OutcomingService,
    IncomingRequestStrategyContext,
  ],
  exports: [IncomingModule],
  controllers: [IncomingController],
})
export class IncomingModule {}
