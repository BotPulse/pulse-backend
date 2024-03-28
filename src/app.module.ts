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
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.development.env', '.env'],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'), // Obtiene el valor de REDIS_HOST de tu ConfigService, o utiliza 'localhost' como valor por defecto
          port: configService.get<number>('REDIS_PORT'), // Obtiene el valor de REDIS_PORT de tu ConfigService, o utiliza 6379 como valor por defecto
        },
      }),
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
