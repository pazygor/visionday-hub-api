import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendEmail(email: string, message: string): Promise<void> {
    //console.log('sendEmail:', email, message);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Alerta do Sistema',
      html: message, // ou `text: message` se for texto puro
    });
  }
}