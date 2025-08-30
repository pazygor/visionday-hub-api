import { Test, TestingModule } from '@nestjs/testing';
import { TaskDeployService } from './task-deploy.service';

describe('TaskDeployService', () => {
  let service: TaskDeployService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskDeployService],
    }).compile();

    service = module.get<TaskDeployService>(TaskDeployService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
