import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceContaPagarDto } from './dto/create-finance-conta-pagar.dto';
import { UpdateFinanceContaPagarDto } from './dto/update-finance-conta-pagar.dto';
import { RegistrarPagamentoDto } from './dto/registrar-pagamento.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FinanceContaPagarService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, createDto: CreateFinanceContaPagarDto, createdBy: number) {
    const { numeroParcelas = 1, ...rest } = createDto;
    const valorTotal = new Decimal(createDto.valorTotal);

    const conta = await this.prisma.financeContaPagar.create({
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
        contaPagarId: contaId,
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
    fornecedorId?: number;
    dataInicio?: string;
    dataFim?: string;
  }) {
    return this.prisma.financeContaPagar.findMany({
      where: {
        usuarioId,
        ...(filtros?.status && { status: filtros.status }),
        ...(filtros?.fornecedorId && { fornecedorId: filtros.fornecedorId }),
        ...(filtros?.dataInicio && {
          dataVencimento: { gte: new Date(filtros.dataInicio) },
        }),
        ...(filtros?.dataFim && {
          dataVencimento: { lte: new Date(filtros.dataFim) },
        }),
      },
      include: {
        fornecedor: true,
        categoria: true,
        contaBancaria: true,
        formaPagamento: true,
        parcelas: true,
      },
      orderBy: { dataVencimento: 'asc' },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const conta = await this.prisma.financeContaPagar.findFirst({
      where: { id, usuarioId },
      include: {
        fornecedor: true,
        categoria: true,
        contaBancaria: true,
        formaPagamento: true,
        parcelas: { orderBy: { numeroParcela: 'asc' } },
        anexos: true,
      },
    });

    if (!conta) {
      throw new NotFoundException(`Conta a pagar #${id} não encontrada`);
    }

    return conta;
  }

  async update(id: number, usuarioId: number, updateDto: UpdateFinanceContaPagarDto, updatedBy: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.financeContaPagar.update({
      where: { id },
      data: {
        ...updateDto,
        updatedBy,
      },
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.financeContaPagar.delete({
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

    return this.prisma.financeContaPagar.update({
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
    const contas = await this.prisma.financeContaPagar.findMany({
      where: { usuarioId },
      select: {
        status: true,
        valorTotal: true,
        valorPago: true,
        valorPendente: true,
      },
    });

    const resumo = {
      totalPagar: new Decimal(0),
      totalPago: new Decimal(0),
      totalPendente: new Decimal(0),
      totalVencidas: new Decimal(0),
    };

    contas.forEach(conta => {
      resumo.totalPagar = resumo.totalPagar.plus(conta.valorTotal);
      resumo.totalPago = resumo.totalPago.plus(conta.valorPago);
      resumo.totalPendente = resumo.totalPendente.plus(conta.valorPendente);
      if (conta.status === 'VENCIDA') {
        resumo.totalVencidas = resumo.totalVencidas.plus(conta.valorPendente);
      }
    });

    return {
      totalPagar: resumo.totalPagar.toNumber(),
      totalPago: resumo.totalPago.toNumber(),
      totalPendente: resumo.totalPendente.toNumber(),
      totalVencidas: resumo.totalVencidas.toNumber(),
    };
  }
}
