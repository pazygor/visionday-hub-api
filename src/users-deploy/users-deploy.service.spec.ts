import { Test, TestingModule } from '@nestjs/testing';
import { UsersDeployService } from './users-deploy.service';

describe('UsersDeployService', () => {
  let service: UsersDeployService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersDeployService],
    }).compile();

    service = module.get<UsersDeployService>(UsersDeployService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
