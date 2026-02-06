import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceConfiguracaoAlertaDto } from './dto/create-finance-configuracao-alerta.dto';
import { UpdateFinanceConfiguracaoAlertaDto } from './dto/update-finance-configuracao-alerta.dto';

@Injectable()
export class FinanceAlertaService {
  constructor(private prisma: PrismaService) {}

  // Configuração de Alertas
  async createConfiguracaoAlerta(usuarioId: number, createDto: CreateFinanceConfiguracaoAlertaDto, createdBy: number) {
    // Verifica se já existe configuração
    const existente = await this.prisma.financeConfiguracaoAlerta.findUnique({
      where: { usuarioId },
    });

    if (existente) {
      return this.updateConfiguracaoAlerta(usuarioId, createDto, createdBy);
    }

    return this.prisma.financeConfiguracaoAlerta.create({
      data: {
        ...createDto,
        usuarioId,
      },
    });
  }

  async getConfiguracaoAlerta(usuarioId: number) {
    const config = await this.prisma.financeConfiguracaoAlerta.findUnique({
      where: { usuarioId },
    });

    if (!config) {
      // Retorna configuração padrão se não existir
      return {
        contasVencerAtivo: true,
        contasVencerDias: 3,
        contasVencidasAtivo: true,
        limiteContaBancariaAtivo: false,
        limiteContaBancariaValor: null,
        emailNotificacao: true,
        notificacaoSistema: true,
      };
    }

    return config;
  }

  async updateConfiguracaoAlerta(usuarioId: number, updateDto: UpdateFinanceConfiguracaoAlertaDto, updatedBy: number) {
    return this.prisma.financeConfiguracaoAlerta.upsert({
      where: { usuarioId },
      create: {
        ...updateDto,
        usuarioId,
      },
      update: {
        ...updateDto,
      },
    });
  }

  // Alertas
  async findAllAlertas(usuarioId: number, apenasNaoLidos?: boolean) {
    return this.prisma.financeAlerta.findMany({
      where: {
        usuarioId,
        ...(apenasNaoLidos && { lido: false }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limita a 50 alertas mais recentes
    });
  }

  async findOneAlerta(id: number, usuarioId: number) {
    const alerta = await this.prisma.financeAlerta.findFirst({
      where: { id, usuarioId },
    });

    if (!alerta) {
      throw new NotFoundException(`Alerta #${id} não encontrado`);
    }

    return alerta;
  }

  async marcarComoLido(id: number, usuarioId: number) {
    await this.findOneAlerta(id, usuarioId);

    return this.prisma.financeAlerta.update({
      where: { id },
      data: { lido: true },
    });
  }

  async marcarTodosComoLidos(usuarioId: number) {
    return this.prisma.financeAlerta.updateMany({
      where: { usuarioId, lido: false },
      data: { lido: true },
    });
  }

  async removeAlerta(id: number, usuarioId: number) {
    await this.findOneAlerta(id, usuarioId);

    return this.prisma.financeAlerta.delete({
      where: { id },
    });
  }

  async getContadorNaoLidos(usuarioId: number): Promise<number> {
    return this.prisma.financeAlerta.count({
      where: { usuarioId, lido: false },
    });
  }

  // Método para gerar alertas (será chamado por um cron job futuramente)
  async gerarAlertas(usuarioId: number) {
    const config = await this.getConfiguracaoAlerta(usuarioId);

    const alertasGerados: string[] = [];

    // Alerta de contas a vencer
    if (config.contasVencerAtivo) {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + config.contasVencerDias);

      const contasVencer = await this.prisma.financeContaReceber.count({
        where: {
          usuarioId,
          status: 'PENDENTE',
          dataVencimento: {
            gte: new Date(),
            lte: dataLimite,
          },
        },
      });

      if (contasVencer > 0) {
        await this.prisma.financeAlerta.create({
          data: {
            usuarioId,
            tipo: 'CONTAS_VENCER',
            titulo: 'Contas a vencer',
            mensagem: `Você tem ${contasVencer} conta(s) a receber vencendo nos próximos ${config.contasVencerDias} dias`,
            severidade: 'AVISO',
          },
        });
        alertasGerados.push('CONTAS_VENCER');
      }
    }

    // Alerta de contas vencidas
    if (config.contasVencidasAtivo) {
      const contasVencidas = await this.prisma.financeContaReceber.count({
        where: {
          usuarioId,
          status: 'VENCIDA',
        },
      });

      if (contasVencidas > 0) {
        await this.prisma.financeAlerta.create({
          data: {
            usuarioId,
            tipo: 'CONTAS_VENCIDAS',
            titulo: 'Contas vencidas',
            mensagem: `Você tem ${contasVencidas} conta(s) a receber vencidas`,
            severidade: 'CRITICO',
          },
        });
        alertasGerados.push('CONTAS_VENCIDAS');
      }
    }

    return { alertasGerados };
  }
}
