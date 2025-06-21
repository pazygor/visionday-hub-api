import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAlertParamDto } from './dto/create-alert-param.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAlertParamDto } from './dto/update-alert-param.dto';
import { ExternalAlertItemDto } from './dto/external-alert.dto';
@Injectable()
export class AlertParamsService {
  constructor(
    private prisma: PrismaService
    // private readonly whats: WhatsAppService,
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
    const byEmpresa = alerts.reduce((acc, cur) => {
      (acc[cur.empresa_id] ||= []).push(cur);
      return acc;
    }, {} as Record<number, ExternalAlertItemDto[]>);

    const results = [];

    // for (const [empresaIdStr, grupo] of Object.entries(byEmpresa)) {
    //   const empresaId = +empresaIdStr;

    //   // 2) busca contatos ativos dessa empresa
    //   const contatos = await this.prisma.contato.findMany({
    //     where: { empresaId, ativo: true },
    //     select: { email: true, celular: true },
    //   });

    //   if (!contatos.length) {
    //     results.push({ empresaId, status: 'sem_contatos' });
    //     continue;
    //   }

    //   // 3) monta as mensagens
    //   const textMsg = this.buildWhatsText(grupo);
    //   const htmlMsg = this.buildHtmlEmail(grupo);

    //   // 4) dispara WhatsApp
    //   await Promise.all(
    //     contatos
    //       .filter(c => c.celular)
    //       .map(c => this.whats.sendText(c.celular!, textMsg)),
    //   );

    //   // 5) dispara e‑mail
    //   await Promise.all(
    //     contatos
    //       .filter(c => c.email)
    //       .map(c => this.mail.sendHtml(c.email!, '🚨 Alerta de Monitoramento', htmlMsg)),
    //   );

    //   // 6) (opcional) salva os alertas no banco
    //   await this.prisma.alerta.createMany({
    //     data: grupo.map(g => ({
    //       empresaId,
    //       ...g,              // campos que existirem na tabela
    //     })),
    //   });

    //   results.push({ empresaId, enviadosPara: contatos.length });
    // }

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
          <td>${a.nome_campo}</td>
          <td>${a.valor}${a.unidade}</td>
          <td>${a.ip}</td>
          <td>${a.tenant}/${a.env}</td>
          <td>${a.timestamp}</td>
        </tr>`,
      )
      .join('');
    return `
      <h2 style="color:#d9534f">Alertas de Monitoramento</h2>
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr style="background:#f5f5f5">
            <th>Métrica</th><th>Valor</th><th>IP</th>
            <th>Ambiente</th><th>Timestamp</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

}
