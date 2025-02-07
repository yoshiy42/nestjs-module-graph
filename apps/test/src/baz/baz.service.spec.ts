import { Test, TestingModule } from '@nestjs/testing';
import { BazService } from './baz.service';

describe('BazService', () => {
  let service: BazService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BazService],
    }).compile();

    service = module.get<BazService>(BazService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
