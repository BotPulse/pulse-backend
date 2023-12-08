import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { AlfredBot } from './alfred.bot';
import { BotFactory } from './bot-factory.bot';
import { ConfigModule } from '@nestjs/config';
import { BotProvider } from './bot-provider';
import { CharlesBot } from './charles.bot';
@Module({
  imports: [ConfigModule],
  exports: [BotsService],
  providers: [BotsService, AlfredBot, BotProvider, CharlesBot, BotFactory],
})
export class BotsModule {}
