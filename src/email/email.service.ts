import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    const { email, message } = sendEmailDto;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Alerta do Sistema',
      text: message,
    });
  }
}