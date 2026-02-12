import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceContaReceberDto } from './dto/create-finance-conta-receber.dto';
import { UpdateFinanceContaReceberDto } from './dto/update-finance-conta-receber.dto';
import { RegistrarPagamentoDto } from './dto/registrar-pagamento.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { TipoReceita } from '../modules/finance/enums/tipo-receita.enum';

export interface FiltrosContaReceber {
  tipo?: TipoReceita | TipoReceita[];
  status?: string | string[];
  clienteId?: number;
  categoriaId?: number;
  dataInicio?: Date;
  dataFim?: Date;
  recorrente?: boolean;
  busca?: string;
}

@Injectable()
export class FinanceContaReceberService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, createDto: CreateFinanceContaReceberDto, createdBy: number) {
    const numeroParcelas = createDto.numeroParcelas || 1;
    const valorTotal = new Decimal(createDto.valorTotal);

    // Validar que cliente existe se tipo = CLIENTE
    if (createDto.tipo === TipoReceita.CLIENTE && createDto.clienteId) {
      const cliente = await this.prisma.financeCliente.findFirst({
        where: { id: createDto.clienteId, usuarioId },
      });

      if (!cliente) {
        throw new NotFoundException('Cliente não encontrado');
      }
    }

    // Validar categoria se fornecida
    if (createDto.categoriaId) {
      const categoria = await this.prisma.financeCategoria.findFirst({
        where: { 
          id: createDto.categoriaId, 
          tipo: 'RECEITA',
          OR: [
            { usuarioId },
            { usuarioId: null },
          ],
        },
      });

      if (!categoria) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    if (createDto.contaBancariaId) {
      const contaBancaria = await this.prisma.financeContaBancaria.findFirst({
        where: { id: createDto.contaBancariaId, usuarioId },
      });

      if (!contaBancaria) {
        throw new NotFoundException('Conta bancária não encontrada');
      }
    }

    if (createDto.formaPagamentoId) {
      const formaPagamento = await this.prisma.financeFormaPagamento.findFirst({
        where: { id: createDto.formaPagamentoId, ativo: true },
      });

      if (!formaPagamento) {
        throw new NotFoundException('Forma de pagamento não encontrada');
      }
    }

    // Determinar status inicial baseado na data de vencimento
    const hoje = new Date();
    const dataVencimento = new Date(createDto.dataVencimento);
    let status = 'PENDENTE';
    
    if (dataVencimento < hoje) {
      status = 'VENCIDA';
    }

    // Cria a conta
    const conta = await this.prisma.financeContaReceber.create({
      data: {
        tipo: createDto.tipo as any,
        clienteId: createDto.clienteId,
        categoriaId: createDto.categoriaId,
        contaBancariaId: createDto.contaBancariaId,
        formaPagamentoId: createDto.formaPagamentoId,
        descricao: createDto.descricao,
        observacoes: createDto.observacoes,
        recorrente: createDto.recorrente || false,
        frequenciaRecorrencia: createDto.frequenciaRecorrencia,
        diaVencimentoRecorrente: createDto.diaVencimentoRecorrente,
        numeroDocumento: createDto.numeroDocumento,
        usuarioId,
        valorTotal,
        valorPago: 0,
        valorPendente: valorTotal,
        numeroParcelas,
        status,
        dataEmissao: createDto.dataEmissao ? new Date(createDto.dataEmissao) : new Date(),
        dataVencimento: new Date(createDto.dataVencimento),
        createdBy,
      },
      include: {
        cliente: true,
        categoria: true,
        contaBancaria: true,
        formaPagamento: true,
      },
    });

    // Se tem parcelas, cria as parcelas
    if (numeroParcelas > 1) {
      await this.criarParcelas(conta.id, valorTotal, numeroParcelas, new Date(createDto.dataVencimento));
    }

    return conta;
  }

  private async criarParcelas(contaId: number, valorTotal: Decimal, numeroParcelas: number, dataVencimento: Date) {
    const valorParcela = valorTotal.dividedBy(numeroParcelas);
    const parcelas: any[] = [];

    for (let i = 1; i <= numeroParcelas; i++) {
      const dataVencimentoParcela = new Date(dataVencimento);
      dataVencimentoParcela.setMonth(dataVencimentoParcela.getMonth() + (i - 1));

      parcelas.push({
        contaReceberId: contaId,
        numeroParcela: i,
        valorParcela,
        dataVencimento: dataVencimentoParcela,
        status: 'PENDENTE',
      });
    }

    await this.prisma.financeParcela.createMany({ data: parcelas });
  }

  async findAll(usuarioId: number, filtros?: FiltrosContaReceber) {
    const where: any = {
      usuarioId,
    };

    // Filtro por tipo
    if (filtros?.tipo) {
      if (Array.isArray(filtros.tipo)) {
        where.tipo = { in: filtros.tipo };
      } else {
        where.tipo = filtros.tipo;
      }
    }

    // Filtro por status
    if (filtros?.status) {
      if (Array.isArray(filtros.status)) {
        where.status = { in: filtros.status };
      } else {
        where.status = filtros.status;
      }
    }

    // Filtro por cliente
    if (filtros?.clienteId) {
      where.clienteId = filtros.clienteId;
    }

    // Filtro por categoria
    if (filtros?.categoriaId) {
      where.categoriaId = filtros.categoriaId;
    }

    // Filtro por data de vencimento
    if (filtros?.dataInicio || filtros?.dataFim) {
      where.dataVencimento = {};
      
      if (filtros.dataInicio) {
        where.dataVencimento.gte = filtros.dataInicio;
      }
      
      if (filtros.dataFim) {
        where.dataVencimento.lte = filtros.dataFim;
      }
    }

    // Filtro por recorrente
    if (filtros?.recorrente !== undefined) {
      where.recorrente = filtros.recorrente;
    }

    // Busca textual
    if (filtros?.busca) {
      where.OR = [
        { descricao: { contains: filtros.busca } },
        { observacoes: { contains: filtros.busca } },
        { cliente: { nome: { contains: filtros.busca } } },
      ];
    }

    return this.prisma.financeContaReceber.findMany({
      where,
      include: {
        cliente: true,
        categoria: true,
        contaBancaria: true,
        formaPagamento: true,
        parcelas: {
          orderBy: { numeroParcela: 'asc' },
        },
      },
      orderBy: { dataVencimento: 'asc' },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const conta = await this.prisma.financeContaReceber.findFirst({
      where: { id, usuarioId },
      include: {
        cliente: true,
        categoria: true,
        contaBancaria: true,
        formaPagamento: true,
        parcelas: { orderBy: { numeroParcela: 'asc' } },
        anexos: true,
      },
    });

    if (!conta) {
      throw new NotFoundException(`Conta a receber #${id} não encontrada`);
    }

    return conta;
  }

  async update(id: number, usuarioId: number, updateDto: UpdateFinanceContaReceberDto, updatedBy: number) {
    const contaAtual = await this.findOne(id, usuarioId);

    // Validações similares ao create
    if (updateDto.tipo === TipoReceita.CLIENTE && updateDto.clienteId) {
      const cliente = await this.prisma.financeCliente.findFirst({
        where: { id: updateDto.clienteId, usuarioId },
      });

      if (!cliente) {
        throw new NotFoundException('Cliente não encontrado');
      }
    }

    if (updateDto.categoriaId) {
      const categoria = await this.prisma.financeCategoria.findFirst({
        where: { 
          id: updateDto.categoriaId, 
          tipo: 'RECEITA',
          OR: [
            { usuarioId },
            { usuarioId: null },
          ],
        },
      });

      if (!categoria) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    if (updateDto.contaBancariaId) {
      const contaBancaria = await this.prisma.financeContaBancaria.findFirst({
        where: { id: updateDto.contaBancariaId, usuarioId },
      });

      if (!contaBancaria) {
        throw new NotFoundException('Conta bancária não encontrada');
      }
    }

    if (updateDto.formaPagamentoId) {
      const formaPagamento = await this.prisma.financeFormaPagamento.findFirst({
        where: { id: updateDto.formaPagamentoId, ativo: true },
      });

      if (!formaPagamento) {
        throw new NotFoundException('Forma de pagamento não encontrada');
      }
    }

    // Preparar dados para atualização
    const updateData: any = {
      ...updateDto,
      updatedBy,
    };

    // Converter datas se fornecidas
    if (updateDto.dataEmissao) {
      updateData.dataEmissao = new Date(updateDto.dataEmissao);
    }

    if (updateDto.dataVencimento) {
      updateData.dataVencimento = new Date(updateDto.dataVencimento);
    }

    const valorTotalAtualizado = updateDto.valorTotal !== undefined
      ? new Decimal(updateDto.valorTotal)
      : new Decimal(contaAtual.valorTotal);

    const valorPagoAtualizado = updateDto.valorPago !== undefined
      ? new Decimal(updateDto.valorPago)
      : new Decimal(contaAtual.valorPago);

    if (valorPagoAtualizado.greaterThan(valorTotalAtualizado)) {
      throw new BadRequestException('Valor pago não pode ser maior que o valor total');
    }

    updateData.valorPendente = valorTotalAtualizado.minus(valorPagoAtualizado);

    if (!updateDto.status) {
      if (valorPagoAtualizado.isZero()) {
        const referenciaVencimento = updateData.dataVencimento
          ? new Date(updateData.dataVencimento)
          : new Date(contaAtual.dataVencimento);

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        referenciaVencimento.setHours(0, 0, 0, 0);

        updateData.status = referenciaVencimento < hoje ? 'VENCIDA' : 'PENDENTE';
      } else if (valorPagoAtualizado.greaterThanOrEqualTo(valorTotalAtualizado)) {
        updateData.status = 'PAGA';
      } else {
        updateData.status = 'PARCIALMENTE_PAGA';
      }
    }

    return this.prisma.financeContaReceber.update({
      where: { id },
      data: updateData,
      include: {
        cliente: true,
        categoria: true,
        contaBancaria: true,
        formaPagamento: true,
        parcelas: true,
      },
    });
  }

  async remove(id: number, usuarioId: number) {
    const conta = await this.findOne(id, usuarioId);

    // Verificar se pode ser removida (não pode ter pagamentos registrados)
    if (new Decimal(conta.valorPago).greaterThan(0)) {
      throw new BadRequestException('Não é possível excluir uma conta que já possui pagamentos registrados');
    }

    return this.prisma.financeContaReceber.delete({
      where: { id },
    });
  }

  async registrarPagamento(id: number, usuarioId: number, dto: RegistrarPagamentoDto) {
    const conta = await this.findOne(id, usuarioId);
    
    const valorPagoAtual = new Decimal(conta.valorPago);
    const valorNovoPagamento = new Decimal(dto.valor);
    const valorPago = valorPagoAtual.plus(valorNovoPagamento);
    const valorTotal = new Decimal(conta.valorTotal);

    if (valorPago.greaterThan(valorTotal)) {
      throw new BadRequestException('Valor pago não pode ser maior que o valor total');
    }

    const valorPendente = valorTotal.minus(valorPago);
    let status = conta.status;

    if (valorPendente.isZero()) {
      status = 'PAGA';
    } else if (valorPago.greaterThan(0)) {
      status = 'PARCIALMENTE_PAGA';
    }

    // Atualizar saldo da conta bancária se fornecida
    if (dto.contaBancariaId) {
      const contaBancaria = await this.prisma.financeContaBancaria.findFirst({
        where: { id: dto.contaBancariaId, usuarioId },
      });

      if (!contaBancaria) {
        throw new NotFoundException('Conta bancária não encontrada');
      }

      await this.prisma.financeContaBancaria.update({
        where: { id: dto.contaBancariaId },
        data: {
          saldoAtual: {
            increment: valorNovoPagamento,
          },
        },
      });
    }

    if (dto.formaPagamentoId) {
      const formaPagamento = await this.prisma.financeFormaPagamento.findFirst({
        where: { id: dto.formaPagamentoId, ativo: true },
      });

      if (!formaPagamento) {
        throw new NotFoundException('Forma de pagamento não encontrada');
      }
    }

    return this.prisma.financeContaReceber.update({
      where: { id },
      data: {
        valorPago,
        valorPendente,
        status,
        dataPagamento: status === 'PAGA' ? new Date(dto.dataPagamento) : null,
        contaBancariaId: dto.contaBancariaId || conta.contaBancariaId,
        formaPagamentoId: dto.formaPagamentoId || conta.formaPagamentoId,
        observacoes: dto.observacoes || conta.observacoes,
      },
      include: {
        cliente: true,
        categoria: true,
        contaBancaria: true,
        formaPagamento: true,
      },
    });
  }

  async getResumo(usuarioId: number) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    // Total pendente
    const totalPendenteResult = await this.prisma.financeContaReceber.aggregate({
      where: {
        usuarioId,
        status: { in: ['PENDENTE', 'PARCIALMENTE_PAGA', 'VENCIDA'] },
      },
      _sum: { valorPendente: true },
      _count: true,
    });

    // Total vencido
    const totalVencidoResult = await this.prisma.financeContaReceber.aggregate({
      where: {
        usuarioId,
        status: 'VENCIDA',
      },
      _sum: { valorPendente: true },
      _count: true,
    });

    // Total pago no mês
    const totalPagoResult = await this.prisma.financeContaReceber.aggregate({
      where: {
        usuarioId,
        status: 'PAGA',
        dataPagamento: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
      _sum: { valorPago: true },
      _count: true,
    });

    // Total do mês (vencimento no mês)
    const totalMesResult = await this.prisma.financeContaReceber.aggregate({
      where: {
        usuarioId,
        dataVencimento: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
      _sum: { valorTotal: true },
    });

    // Próximos recebimentos (próximos 7 dias)
    const proximos7Dias = new Date();
    proximos7Dias.setDate(proximos7Dias.getDate() + 7);

    const proximosRecebimentos = await this.prisma.financeContaReceber.findMany({
      where: {
        usuarioId,
        status: { in: ['PENDENTE', 'PARCIALMENTE_PAGA'] },
        dataVencimento: {
          gte: hoje,
          lte: proximos7Dias,
        },
      },
      include: {
        cliente: true,
        categoria: true,
      },
      orderBy: { dataVencimento: 'asc' },
      take: 5,
    });

    return {
      totalPendente: Number(totalPendenteResult._sum.valorPendente || 0),
      totalPago: Number(totalPagoResult._sum.valorPago || 0),
      totalVencido: Number(totalVencidoResult._sum.valorPendente || 0),
      totalMes: Number(totalMesResult._sum.valorTotal || 0),
      contasPendentes: totalPendenteResult._count - totalVencidoResult._count,
      contasVencidas: totalVencidoResult._count,
      contasPagas: totalPagoResult._count,
      proximosRecebimentos,
    };
  }

  /**
   * Atualiza status de contas vencidas (job executado diariamente)
   */
  async atualizarContasVencidas() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    await this.prisma.financeContaReceber.updateMany({
      where: {
        status: { in: ['PENDENTE', 'PARCIALMENTE_PAGA'] },
        dataVencimento: { lt: hoje },
      },
      data: {
        status: 'VENCIDA',
      },
    });
  }
}