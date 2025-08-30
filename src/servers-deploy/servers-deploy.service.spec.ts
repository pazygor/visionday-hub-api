import { Test, TestingModule } from '@nestjs/testing';
import { ServersDeployService } from './servers-deploy.service';

describe('ServersDeployService', () => {
  let service: ServersDeployService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServersDeployService],
    }).compile();

    service = module.get<ServersDeployService>(ServersDeployService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
