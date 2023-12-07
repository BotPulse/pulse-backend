import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const generateWhatsappUrl = (id: string) =>
  `https://graph.facebook.com/v17.0/${id}/messages`;

export const WhatsappUrlProvider: Provider = {
  provide: 'WhatsappUrlMap',
  useFactory: (configService: ConfigService): Map<string, string> =>
    new Map([
      [
        configService.get<string>('TEST_WA_ID'),
        generateWhatsappUrl(configService.get<string>('TEST_NUMBER_ID')),
      ],
      [
        configService.get<string>('ALFRED_WA_ID'),
        generateWhatsappUrl(configService.get<string>('ALFRED_NUMBER_ID')),
      ],
    ]),
  inject: [ConfigService],
};
