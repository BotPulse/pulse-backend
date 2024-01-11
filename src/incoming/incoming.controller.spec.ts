import { Test, TestingModule } from '@nestjs/testing';
import { IncomingController } from './incoming.controller';

describe('IncomingController', () => {
  let controller: IncomingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomingController],
    }).compile();

    controller = module.get<IncomingController>(IncomingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
