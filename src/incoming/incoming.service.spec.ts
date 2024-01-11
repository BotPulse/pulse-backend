import { Test, TestingModule } from '@nestjs/testing';
import { IncomingService } from './incoming.service';

describe('IncomingService', () => {
  let service: IncomingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncomingService],
    }).compile();

    service = module.get<IncomingService>(IncomingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
