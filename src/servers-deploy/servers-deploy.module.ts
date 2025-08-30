import { Module } from '@nestjs/common';
import { ServersDeployService } from './servers-deploy.service';
import { ServersDeployController } from './servers-deploy.controller';

@Module({
  controllers: [ServersDeployController],
  providers: [ServersDeployService],
})
export class ServersDeployModule {}
