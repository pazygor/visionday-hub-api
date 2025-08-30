import { Module } from '@nestjs/common';
import { UsersDeployService } from './users-deploy.service';
import { UsersDeployController } from './users-deploy.controller';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [UserModule], // ⚠️ importa o UserService
  controllers: [UsersDeployController],
  providers: [UsersDeployService],
})
export class UsersDeployModule {}
