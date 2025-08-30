import { Test, TestingModule } from '@nestjs/testing';
import { OperationsDeployService } from './operations-deploy.service';

describe('OperationsDeployService', () => {
  let service: OperationsDeployService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationsDeployService],
    }).compile();

    service = module.get<OperationsDeployService>(OperationsDeployService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
