import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<{ message: string }> {
    const { email, message } = sendEmailDto;
    await this.emailService.sendEmail(email, message); // ✅ Agora funciona
    return { message: 'E-mail enviado com sucesso' };
  }
}

// import { Controller } from '@nestjs/common';
// import { EmailService } from './email.service';

// @Controller('email')
// export class EmailController {
//   constructor(private readonly emailService: EmailService) {}
// }
