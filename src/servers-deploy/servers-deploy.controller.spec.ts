import { Test, TestingModule } from '@nestjs/testing';
import { ServersDeployController } from './servers-deploy.controller';
import { ServersDeployService } from './servers-deploy.service';

describe('ServersDeployController', () => {
  let controller: ServersDeployController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServersDeployController],
      providers: [ServersDeployService],
    }).compile();

    controller = module.get<ServersDeployController>(ServersDeployController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
