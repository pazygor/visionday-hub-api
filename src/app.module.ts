import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { EmailModule } from './email/email.module';
import { ProjectsModule } from './projects/projects.module';
import { ServersModule } from './servers/servers.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { GroupUserModule } from './group-user/group-user.module';
import { GroupAlertModule } from './group-alert/group-alert.module';

import { AuthModule } from './auth/auth.module';
import { MonitorModule } from './monitor/monitor.module';
import { ExternalModule } from './external/external.module';
import { ProductModule } from './product/product.module';
import { CompanyProductModule } from './company-product/company-product.module';
import { AlertUserModule } from './alert-user/alert-user.module';
import { AlertParamsModule } from './alert-params/alert-params.module';
import { UserProductModule } from './user-product/user-product.module';
import { UserProductSystemModule } from './user-product-system/user-product-system.module';
import { UsersDeployModule } from './users-deploy/users-deploy.module';
import { OperationsDeployModule } from './operations-deploy/operations-deploy.module';
import { TaskDeployModule } from './task-deploy/task-deploy.module';
import { ServersDeployModule } from './servers-deploy/servers-deploy.module';

@Module({
  imports: [ContactsModule, WhatsappModule, EmailModule, ProjectsModule, ServersModule, CompanyModule, UserModule, GroupModule, GroupUserModule, GroupAlertModule, AuthModule, MonitorModule, ExternalModule, ProductModule, CompanyProductModule, AlertUserModule, AlertParamsModule, UserProductModule, UserProductSystemModule, UsersDeployModule, OperationsDeployModule, TaskDeployModule, ServersDeployModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
