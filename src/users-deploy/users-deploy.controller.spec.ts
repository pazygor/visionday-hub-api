import { Test, TestingModule } from '@nestjs/testing';
import { UsersDeployController } from './users-deploy.controller';
import { UsersDeployService } from './users-deploy.service';

describe('UsersDeployController', () => {
  let controller: UsersDeployController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersDeployController],
      providers: [UsersDeployService],
    }).compile();

    controller = module.get<UsersDeployController>(UsersDeployController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
