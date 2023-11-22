import { Module } from '@nestjs/common';
import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';
import { HttpServiceConfig } from 'src/httpService.config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpServiceConfig,
    }),
    ShareModuleModule,
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class ShareModuleModule {}
