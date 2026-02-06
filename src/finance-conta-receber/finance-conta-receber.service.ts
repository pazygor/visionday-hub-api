import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceContaReceberDto } from './dto/create-finance-conta-receber.dto';
import { UpdateFinanceContaReceberDto } from './dto/update-finance-conta-receber.dto';
import { RegistrarPagamentoDto } from './dto/registrar-pagamento.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FinanceContaReceberService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, createDto: CreateFinanceContaReceberDto, createdBy: number) {
    const { numeroParcelas = 1, ...rest } = createDto;
    const valorTotal = new Decimal(createDto.valorTotal);

    // Cria a conta
    const conta = await this.prisma.financeContaReceber.create({
      data: {
        ...rest,
        usuarioId,
        valorTotal,
        valorPago: 0,
        valorPendente: valorTotal,
        numeroParcelas,
        status: 'PENDENTE',
        createdBy,
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

  async findAll(usuarioId: number, filtros?: {
    status?: string;
    clienteId?: number;
    dataInicio?: string;
    dataFim?: string;
  }) {
    return this.prisma.financeContaReceber.findMany({
      where: {
        usuarioId,
        ...(filtros?.status && { status: filtros.status }),
        ...(filtros?.clienteId && { clienteId: filtros.clienteId }),
        ...(filtros?.dataInicio && {
          dataVencimento: { gte: new Date(filtros.dataInicio) },
        }),
        ...(filtros?.dataFim && {
          dataVencimento: { lte: new Date(filtros.dataFim) },
        }),
      },
      include: {
        cliente: true,
        categoria: true,
        contaBancaria: true,
        formaPagamento: true,
        parcelas: true,
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
    await this.findOne(id, usuarioId);

    return this.prisma.financeContaReceber.update({
      where: { id },
      data: {
        ...updateDto,
        updatedBy,
      },
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.financeContaReceber.delete({
      where: { id },
    });
  }

  async registrarPagamento(id: number, usuarioId: number, dto: RegistrarPagamentoDto) {
    const conta = await this.findOne(id, usuarioId);
    const valorPago = new Decimal(conta.valorPago).plus(dto.valor);
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

    return this.prisma.financeContaReceber.update({
      where: { id },
      data: {
        valorPago,
        valorPendente,
        status,
        dataPagamento: status === 'PAGA' ? new Date(dto.dataPagamento) : null,
      },
    });
  }

  async getResumo(usuarioId: number) {
    const contas = await this.prisma.financeContaReceber.findMany({
      where: { usuarioId },
      select: {
        status: true,
        valorTotal: true,
        valorPago: true,
        valorPendente: true,
      },
    });

    const resumo = {
      totalReceber: new Decimal(0),
      totalRecebido: new Decimal(0),
      totalPendente: new Decimal(0),
      totalVencidas: new Decimal(0),
    };

    contas.forEach(conta => {
      resumo.totalReceber = resumo.totalReceber.plus(conta.valorTotal);
      resumo.totalRecebido = resumo.totalRecebido.plus(conta.valorPago);
      resumo.totalPendente = resumo.totalPendente.plus(conta.valorPendente);
      if (conta.status === 'VENCIDA') {
        resumo.totalVencidas = resumo.totalVencidas.plus(conta.valorPendente);
      }
    });

    return {
      totalReceber: resumo.totalReceber.toNumber(),
      totalRecebido: resumo.totalRecebido.toNumber(),
      totalPendente: resumo.totalPendente.toNumber(),
      totalVencidas: resumo.totalVencidas.toNumber(),
    };
  }
}
