import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OutcomingModule } from './outcoming/outcoming.module';
import { IncomingModule } from './incoming/incoming.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationsModule } from './conversations/conversations.module';
import { BotsModule } from './bots/bots.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BpassistantModule } from './bpassistant/bpassistant.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.development.env', '.env'],
    }),
    OutcomingModule,
    IncomingModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService], // Inyecta ConfigService en la factoría
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),
    ConversationsModule,
    BotsModule,
    AuthModule,
    UsersModule,
    BpassistantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
