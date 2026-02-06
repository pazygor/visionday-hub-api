import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceFormaPagamentoDto } from './dto/create-finance-forma-pagamento.dto';
import { UpdateFinanceFormaPagamentoDto } from './dto/update-finance-forma-pagamento.dto';

@Injectable()
export class FinanceFormaPagamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateFinanceFormaPagamentoDto) {
    return this.prisma.financeFormaPagamento.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.financeFormaPagamento.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number) {
    const forma = await this.prisma.financeFormaPagamento.findUnique({
      where: { id },
    });

    if (!forma) {
      throw new NotFoundException(`Forma de pagamento #${id} não encontrada`);
    }

    return forma;
  }

  async update(id: number, updateDto: UpdateFinanceFormaPagamentoDto) {
    await this.findOne(id);

    return this.prisma.financeFormaPagamento.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.financeFormaPagamento.delete({
      where: { id },
    });
  }
}
