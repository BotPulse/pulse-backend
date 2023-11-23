import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModuleModule } from './share-module/share-module.module';
import { ConfigModule } from '@nestjs/config';
import { OutcomingModule } from './outcoming/outcoming.module';
import { IncomingModule } from './incoming/incoming.module';

@Module({
  imports: [
    ShareModuleModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OutcomingModule,
    IncomingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
