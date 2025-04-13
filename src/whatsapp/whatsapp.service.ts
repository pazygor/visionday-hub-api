import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SendMessageDto } from './dto/send-message.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
    constructor(private readonly httpService: HttpService) { }

    async sendMessage(dto: SendMessageDto) {
        const url = 'http://localhost:8080/message/sendText/svs-monitor';
        const headers = {
            'Content-Type': 'application/json',
            'apikey': '2mIEHk4y3yS/n5RILB8fYoThCUXCeaJVX+8BtKJN928=', // Chave fixa para teste
        };
        const data = {
            number: dto.number,
            text: dto.message,
            options: {
              delay: 0,
              presence: 'composing',
              linkPreview: true,
              // Outros campos conforme necessário
            },
        };

        try {
            const response = await firstValueFrom(
                this.httpService.post(url, data, { headers })
            );
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao enviar mensagem: ${error.message}`);
        }
    }
    async teste(teste: any) {
        return (teste);
        // const url = 'http://localhost:8080/message/sendText/svs-monitor';
        // const headers = {    
        //     'Content-Type': 'application/json',
        //     'apikey': process.env.AUTHENTICATION_API_KEY,
        // };
        // const data = {
        //     number: '55999999999',
        //     textMessage: {
        //         text: 'Teste de envio de mensagem',
        //     },
        // };            
        // try {
        //     const response = await firstValueFrom(
        //         this.httpService.post(url, data, { headers })
        //     );
        //     return response.data;
        // } catch (error) {
        //     // Tratamento de erro apropriado
        //     throw new Error(`Erro ao enviar mensagem: ${error.message}`);
        // }
    }
}