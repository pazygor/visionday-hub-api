import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAlertParamDto } from './dto/create-alert-param.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAlertParamDto } from './dto/update-alert-param.dto';
import { ExternalAlertItemDto } from './dto/external-alert.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EmailService } from '../email/email.service';
@Injectable()
export class AlertParamsService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService, // ← aqui
    private readonly email: EmailService,
    // private readonly mail: MailService,
  ) { }
  async findAll() {
    return this.prisma.alertaParametro.findMany();
  }

  async findOne(id: number) {
    return this.prisma.alertaParametro.findUnique({
      where: { id },
    });
  }

  async findByServerId(serverId: number) {
    return this.prisma.alertaParametro.findMany({
      where: {
        serverId: serverId,
      },
    });
  }

  async create(createAlertParamDto: CreateAlertParamDto) {
    return this.prisma.alertaParametro.create({
      data: createAlertParamDto,
    });
  }

  async update(id: number, updateAlertParamDto: UpdateAlertParamDto) {
    return this.prisma.alertaParametro.update({
      where: { id },
      data: updateAlertParamDto,
    });
  }

  async remove(id: number) {
    return this.prisma.alertaParametro.delete({
      where: { id },
    });
  }
  async saveOrUpdateAll(alertParams: CreateAlertParamDto[], serverId: number) {
    if (!serverId) {
      throw new BadRequestException('serverId é obrigatório');
    }

    // Apaga todos os registros existentes com o mesmo serverId
    await this.prisma.alertaParametro.deleteMany({
      where: { serverId },
    });

    // Insere todos os novos registros
    await Promise.all(alertParams.map(data => {
      return this.prisma.alertaParametro.create({
        data: {
          nomeCampo: data.nomeCampo,
          criticidade: { connect: { id: data.criticidadeId } },
          unidadeValor: data.unidadeValor,
          valor: data.valor,
          servidor: { connect: { id: data.serverId } },
          empresa: { connect: { id: data.empresaId } },
          metrica: { connect: { id: data.metricasId } },
          type: data.type,
          tenant: data.tenant,
          env: data.env,
          ip: data.ip
        }
      });
    }));

    // Retorna os registros inseridos
    return this.prisma.alertaParametro.findMany({
      where: { serverId },
    });
  }
  async processExternalAlerts(alerts: ExternalAlertItemDto[]) {
    // 1) agrupa por empresa para uma notificação única
    const byServidor = alerts.reduce((acc, cur) => {
      (acc[cur.servidor_id] ||= []).push(cur);
      return acc;
    }, {} as Record<number, ExternalAlertItemDto[]>);

    const results: { servidorId: number; status?: string; enviados?: number }[] = [];
    //console.log(alerts);
    for (const [servidorIdStr, grupo] of Object.entries(byServidor)) {
      const servidorId = +servidorIdStr;

      // 2) busca contatos ativos dessa empresa
      const usuarios = await this.prisma.alertaUsuario.findMany({
        where: { servidorId },
        select: { contato: true },
      });

      if (!usuarios.length) {
        results.push({ servidorId, status: 'sem_contatos' });
        continue;
      }
      // Separa e-mails e celulares (forma simples de separar)
      const emails: string[] = [];
      const telefones: string[] = [];

      for (const u of usuarios) {
        if (u.contato.includes('@')) emails.push(u.contato);
        else telefones.push(u.contato.replace(/\D/g, '')); // remove tudo que não é número
      }
      // 3) monta as mensagens
      const textMsg = this.buildWhatsText(grupo);
      const htmlMsg = this.buildHtmlEmail(grupo);
      await Promise.all(
        telefones.map(tel =>
          this.sendMessage({ number: tel, message: textMsg }),
        ),
      );
      await Promise.all(emails.map(email => this.email.sendEmail(email, htmlMsg)));

      results.push({ servidorId, enviados: emails.length + telefones.length });
    }

    return { ok: true, results };
  }

  // ---- helpers -------------------------------------------------------

  private buildWhatsText(alerts: ExternalAlertItemDto[]): string {
    const header = '🚨 *ALERTA(S) DE MONITORAMENTO* 🚨\n';
    return (
      header +
      alerts
        .map(
          a =>
            `• ${a.nome_campo} em ${a.ip} ` +
            `(${a.tenant}/${a.env}) ⇒ *${a.valor}${a.unidade}* ` +
            `(${a.timestamp})`,
        )
        .join('\n')
    );
  }

  private buildHtmlEmail(alerts: ExternalAlertItemDto[]): string {
    const rows = alerts
      .map(
        a => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${a.nome_campo}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${a.valor}${a.unidade}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${a.ip}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${a.tenant}/${a.env}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${a.timestamp}</td>
        </tr>`,
      )
      .join('');

    return `
    <div style="font-family: Arial, sans-serif; font-size: 14px;">
      <h2 style="color:#d9534f">🚨 Alertas de Monitoramento</h2>
      <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Métrica</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Valor</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">IP</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Ambiente</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Timestamp</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
  }
  async sendMessage(dto: { number: string; message: string }) {
    const url = 'http://20.206.249.202:8080/message/sendText/ygor';
    const headers = {
      'Content-Type': 'application/json',
      'apikey': 'f7b0f19cb635ad60ef8d4f5cdb88a5a9',
    };

    // 🧠 Garante que o número está no formato correto: 55 + DDD + número
    let number = dto.number.replace(/\D/g, ''); // remove tudo que não é número

    if (!number.startsWith('55')) {
      number = `55${number}`;
    }

    const data = {
      number, // agora no formato correto
      text: dto.message,
      options: {
        delay: 0,
        presence: 'composing',
        linkPreview: true,
      },
    };

    //console.log(data); // ✅ agora o number será: 5511XXXXXXXXX

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers })
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao enviar WhatsApp:', error?.message || error);
      return { error: true, message: error?.message || 'Erro desconhecido' };
    }
  }

}
