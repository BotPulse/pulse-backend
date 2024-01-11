import { Test, TestingModule } from '@nestjs/testing';
import { OutcomingController } from './outcoming.controller';

describe('OutcomingController', () => {
  let controller: OutcomingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutcomingController],
    }).compile();

    controller = module.get<OutcomingController>(OutcomingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
