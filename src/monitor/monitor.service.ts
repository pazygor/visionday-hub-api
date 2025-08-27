import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Projeto } from '@prisma/client';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

@Injectable()
export class MonitorService {
  constructor(private prisma: PrismaService) { }
  async create(dto: CreateMonitorDto) {
    return this.prisma.monitoramento.create({
      data: {
        empresa_id: dto.empresa_id,
        nome_monitoramento: dto.nome_monitoramento,
        produto: dto.produto,
        projetos: dto.projetos, // Prisma já aceita objeto JS para JSON
        servidores: dto.servidores,
      },
    });
  }
  async findAllByEmpresa(empresaId: number) {
    return this.prisma.monitoramento.findMany({
      where: { empresa_id: empresaId },
    });
  }

  async findOne(id: number) {
    const monitoramento = await this.prisma.monitoramento.findUnique({
      where: { id },
    });
    if (!monitoramento) {
      throw new NotFoundException(`Monitoramento com ID ${id} não encontrado`);
    }
    return monitoramento;
  }

  async update(id: number, dto: UpdateMonitorDto) {
    // verifica se existe
    await this.findOne(id);

    return this.prisma.monitoramento.update({
      where: { id },
      data: {
        nome_monitoramento: dto.nome_monitoramento,
        produto: dto.produto,
        projetos: dto.projetos,
        servidores: dto.servidores,
        status: dto.status,
      },
    });
  }

  async remove(id: number) {
    // verifica se existe
    await this.findOne(id);

    return this.prisma.monitoramento.delete({
      where: { id },
    });
  }
  async getMonitoramentosPorUsuario(usuarioId: number) {
    const empresa = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { empresa: true },
    });

    if (!empresa) {
      throw new NotFoundException(`Usuário com id ${usuarioId} não encontrado.`);
    }
    //return empresa;
    const empresa_id = empresa.empresa.id;
    return this.prisma.monitoramento.findMany({
      where: { empresa_id: empresa_id },
    });
  }
  async createMonitoramentoCompleto(dados: any) {
    const { monitoramento, projetos } = dados;

    const tipoColeta = monitoramento.tipo_coleta;
    const empresaId = monitoramento.empresa_id;

    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: {
        limiteProjetos: true,
        limiteServidores: true,
        tenant: true
      }
    });

    if (!empresa) {
      throw new Error('Empresa não encontrada.');
    }

    const totalProjetosNovo = projetos.length;
    const totalServidoresNovo = projetos.reduce((acc, proj) => acc + proj.servidores.length, 0);

    const projetosAtuais = await this.prisma.projeto.count({
      where: { empresaId: empresaId }
    });

    const servidoresAtuais = await this.prisma.servidor.count({
      where: { empresaId: empresaId }
    });

    if (tipoColeta === 'SVS Monitor') {
      if ((servidoresAtuais + totalServidoresNovo) > empresa.limiteServidores) {
        throw new Error('Limite de servidores excedido.');
      }
    } else if (tipoColeta === 'SVS Insights') {
      if ((projetosAtuais + totalProjetosNovo) > empresa.limiteProjetos) {
        throw new Error('Limite de projetos excedido.');
      }
    }

    const projetosCriados: Projeto[] = [];
    const servidoresCriados: any[] = [];

    for (const proj of projetos) {
      // 1. Criar o projeto sem o env
      const projetoCriado = await this.prisma.projeto.create({
        data: {
          nome: proj.nome,
          env: '', // temporário
          tenant: empresa.tenant,
          dataInicio: new Date(),
          status: 'ativo',
          localArmazenamento: '',
          empresaId: empresaId,
          monitoramentoProtheus: proj.hasProtheusMonitoring
        }
      });

      // 2. Gerar o env com base no ID
      const env = projetoCriado.id.toString().padStart(6, '0');

      // 3. Atualizar o projeto com o env
      const projetoAtualizado = await this.prisma.projeto.update({
        where: { id: projetoCriado.id },
        data: { env }
      });

      // 4. Criar os servidores ligados a esse projeto
      for (const srv of proj.servidores) {
        // ✅ Definição de nome e senha de acordo com o SO
        const nomeUsuario =
          srv.sistema_operacional === 'Windows' ? srv.dominioUser : srv.user;

        const servidorCriado = await this.prisma.servidor.create({
          data: {
            nome: srv.nome,
            ip: srv.ip,
            tipo: srv.tipo || 'teste',
            sistemaOperacional: srv.sistema_operacional,
            status: 'ativo',
            projetoId: projetoCriado.id,
            empresaId: empresaId,

            /* Novos campos */
            nomeUsuario: nomeUsuario,
            senhaUsuario: srv.senha,
            sudo: srv.sudo,
            data: srv.data
          }
        });

        servidoresCriados.push({
          id: servidorCriado.id,
          nome: servidorCriado.nome,
          ip: servidorCriado.ip,
          sistemaOperacional: servidorCriado.sistemaOperacional,
          tipo: servidorCriado.tipo,
          projetoId: servidorCriado.projetoId,
          empresaId: servidorCriado.empresaId,
          nomeUsuario: servidorCriado.nomeUsuario,
          senhaUsuario: servidorCriado.senhaUsuario,
          sudo: servidorCriado.sudo,
          data: servidorCriado.data
        });
      }

      projetosCriados.push({
        ...projetoAtualizado,
        localArmazenamento: proj.local_armazenamento
      });
    }

    const listaProjetosJson = projetosCriados.map(p => ({
      id: p.id,
      nome: p.nome,
      env: p.env,
      tenant: p.tenant,
      localArmazenamento: p.localArmazenamento
    }));

    const monitoramentoCriado = await this.prisma.monitoramento.create({
      data: {
        empresa_id: empresaId,
        nome_monitoramento: monitoramento.nome,
        produto: tipoColeta,
        projetos: listaProjetosJson,
        servidores: servidoresCriados,
        status: 'ativo'
      }
    });

    return monitoramentoCriado;
  }
  async validarCriacaoMonitoramento(
    empresaId: number,
    tipo: 'SVS Monitor' | 'SVS Insights',
    qtdNova: number,
  ): Promise<{ permitido: boolean; motivo?: string }> {

    // Busca a empresa para obter os limites
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: {
        limiteProjetos: true,
        limiteServidores: true,
      },
    });

    if (!empresa) {
      return {
        permitido: false,
        motivo: 'Empresa não encontrada.',
      };
    }

    // 🔍 Busca os monitoramentos da empresa
    const monitoramentos = await this.prisma.monitoramento.findMany({
      where: { empresa_id: empresaId },
      select: {
        projetos: true,
        servidores: true,
      },
    });

    let totalAtual = 0;

    if (tipo === 'SVS Monitor') {
      totalAtual = monitoramentos.reduce((acc, mon) => {
        let servidores: any[] = [];

        if (Array.isArray(mon.servidores)) {
          servidores = mon.servidores;
        } else if (typeof mon.servidores === 'string') {
          try {
            servidores = JSON.parse(mon.servidores);
          } catch {
            servidores = [];
          }
        }

        return acc + servidores.length;
      }, 0);

      const limite = empresa.limiteServidores;

      if (totalAtual + qtdNova > limite) {
        return {
          permitido: false,
          motivo: `Limite de servidores excedido. Já possui ${totalAtual} e está tentando adicionar mais ${qtdNova}, mas o limite é ${limite}.`,
        };
      }
    } else if (tipo === 'SVS Insights') {
      totalAtual = monitoramentos.reduce((acc, mon) => {
        let projetos: any[] = [];

        if (Array.isArray(mon.projetos)) {
          projetos = mon.projetos;
        } else if (typeof mon.projetos === 'string') {
          try {
            projetos = JSON.parse(mon.projetos);
          } catch {
            projetos = [];
          }
        }

        return acc + projetos.length;
      }, 0);

      const limite = empresa.limiteProjetos;

      if (totalAtual + qtdNova > limite) {
        return {
          permitido: false,
          motivo: `Limite de projetos excedido. Já possui ${totalAtual} e está tentando adicionar mais ${qtdNova}, mas o limite é ${limite}.`,
        };
      }
    }

    // ✅ Validação passou
    return { permitido: true };
  }
}
