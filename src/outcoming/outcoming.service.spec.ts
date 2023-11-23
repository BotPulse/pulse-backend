import { Test, TestingModule } from '@nestjs/testing';
import { OutcomingService } from './outcoming.service';

describe('OutcomingService', () => {
  let service: OutcomingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutcomingService],
    }).compile();

    service = module.get<OutcomingService>(OutcomingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
