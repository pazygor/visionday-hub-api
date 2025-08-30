import { Test, TestingModule } from '@nestjs/testing';
import { OperationsDeployController } from './operations-deploy.controller';
import { OperationsDeployService } from './operations-deploy.service';

describe('OperationsDeployController', () => {
  let controller: OperationsDeployController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationsDeployController],
      providers: [OperationsDeployService],
    }).compile();

    controller = module.get<OperationsDeployController>(OperationsDeployController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
