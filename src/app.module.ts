import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [ContactsModule, WhatsappModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
