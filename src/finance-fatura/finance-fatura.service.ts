import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceFaturaDto } from './dto/create-finance-fatura.dto';
import { UpdateFinanceFaturaDto } from './dto/update-finance-fatura.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FinanceFaturaService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, createDto: CreateFinanceFaturaDto, createdBy: number) {
    const { itens, desconto = 0, acrescimo = 0, ...rest } = createDto;

    // Calcula valor total dos itens
    const valorTotal = itens.reduce((sum, item) => {
      return sum + item.quantidade * item.valorUnitario;
    }, 0);

    // Calcula valor final
    const valorFinal = new Decimal(valorTotal).minus(desconto).plus(acrescimo);

    // Gera número da fatura
    const numeroFatura = await this.gerarNumeroFatura(usuarioId);

    // Cria fatura
    const fatura = await this.prisma.financeFatura.create({
      data: {
        ...rest,
        usuarioId,
        numeroFatura,
        valorTotal: new Decimal(valorTotal),
        desconto: new Decimal(desconto),
        acrescimo: new Decimal(acrescimo),
        valorFinal,
        status: 'PENDENTE',
        createdBy,
      },
    });

    // Cria itens da fatura
    await this.prisma.financeItemFatura.createMany({
      data: itens.map(item => ({
        faturaId: fatura.id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        valorUnitario: new Decimal(item.valorUnitario),
        valorTotal: new Decimal(item.quantidade * item.valorUnitario),
      })),
    });

    // Cria conta a receber automaticamente
    await this.prisma.financeContaReceber.create({
      data: {
        usuarioId,
        faturaId: fatura.id,
        clienteId: createDto.clienteId,
        categoriaId: createDto.categoriaId,
        contaBancariaId: createDto.contaBancariaId,
        formaPagamentoId: createDto.formaPagamentoId,
        descricao: `Fatura ${numeroFatura}`,
        valorTotal: valorFinal,
        valorPago: 0,
        valorPendente: valorFinal,
        dataEmissao: createDto.dataEmissao,
        dataVencimento: createDto.dataVencimento,
        status: 'PENDENTE',
        createdBy,
      },
    });

    return this.findOne(fatura.id, usuarioId);
  }

  private async gerarNumeroFatura(usuarioId: number): Promise<string> {
    const ano = new Date().getFullYear();
    
    // Busca última fatura do ano
    const ultimaFatura = await this.prisma.financeFatura.findFirst({
      where: {
        usuarioId,
        numeroFatura: {
          startsWith: `${ano}-`,
        },
      },
      orderBy: {
        numeroFatura: 'desc',
      },
    });

    let sequencial = 1;
    if (ultimaFatura) {
      const partes = ultimaFatura.numeroFatura.split('-');
      sequencial = parseInt(partes[1]) + 1;
    }

    return `${ano}-${sequencial.toString().padStart(4, '0')}`;
  }

  async findAll(usuarioId: number, filtros?: {
    status?: string;
    clienteId?: number;
    dataInicio?: string;
    dataFim?: string;
  }) {
    return this.prisma.financeFatura.findMany({
      where: {
        usuarioId,
        ...(filtros?.status && { status: filtros.status }),
        ...(filtros?.clienteId && { clienteId: filtros.clienteId }),
        ...(filtros?.dataInicio && {
          dataEmissao: { gte: new Date(filtros.dataInicio) },
        }),
        ...(filtros?.dataFim && {
          dataEmissao: { lte: new Date(filtros.dataFim) },
        }),
      },
      include: {
        cliente: true,
        itens: true,
        contasReceber: true,
      },
      orderBy: { numeroFatura: 'desc' },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const fatura = await this.prisma.financeFatura.findFirst({
      where: { id, usuarioId },
      include: {
        cliente: true,
        itens: true,
        contasReceber: {
          include: {
            parcelas: true,
          },
        },
      },
    });

    if (!fatura) {
      throw new NotFoundException(`Fatura #${id} não encontrada`);
    }

    return fatura;
  }

  async update(id: number, usuarioId: number, updateDto: UpdateFinanceFaturaDto, updatedBy: number) {
    await this.findOne(id, usuarioId);

    // Remover campos que não podem ser atualizados diretamente
    const { itens, ...updateData } = updateDto;

    return this.prisma.financeFatura.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    // Remove conta a receber associada
    await this.prisma.financeContaReceber.deleteMany({
      where: { faturaId: id },
    });

    return this.prisma.financeFatura.delete({
      where: { id },
    });
  }
}
