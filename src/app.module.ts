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
import { InfraAlertModule } from './infra-alert/infra-alert.module';
import { AppAlertModule } from './app-alert/app-alert.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ContactsModule, WhatsappModule, EmailModule, ProjectsModule, ServersModule, CompanyModule, UserModule, GroupModule, GroupUserModule, GroupAlertModule, InfraAlertModule, AppAlertModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
