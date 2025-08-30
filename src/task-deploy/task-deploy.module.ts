import { Module } from '@nestjs/common';
import { TaskDeployService } from './task-deploy.service';
import { TaskDeployController } from './task-deploy.controller';

@Module({
  controllers: [TaskDeployController],
  providers: [TaskDeployService],
})
export class TaskDeployModule {}
