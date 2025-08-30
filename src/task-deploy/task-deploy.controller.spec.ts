import { Test, TestingModule } from '@nestjs/testing';
import { TaskDeployController } from './task-deploy.controller';
import { TaskDeployService } from './task-deploy.service';

describe('TaskDeployController', () => {
  let controller: TaskDeployController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskDeployController],
      providers: [TaskDeployService],
    }).compile();

    controller = module.get<TaskDeployController>(TaskDeployController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
