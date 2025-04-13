import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) { }

  @Post('send')
  sendMessage(@Body() dto: SendMessageDto) {
    return this.whatsappService.sendMessage(dto);
  }
  @Post('teste')
  teste() {
    return this.whatsappService.teste("teste de requisição123");
  }
}