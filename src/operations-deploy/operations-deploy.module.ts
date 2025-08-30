import { Module } from '@nestjs/common';
import { OperationsDeployService } from './operations-deploy.service';
import { OperationsDeployController } from './operations-deploy.controller';

@Module({
  controllers: [OperationsDeployController],
  providers: [OperationsDeployService],
})
export class OperationsDeployModule {}
