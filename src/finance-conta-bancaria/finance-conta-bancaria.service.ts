import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceContaBancariaDto } from './dto/create-finance-conta-bancaria.dto';
import { UpdateFinanceContaBancariaDto } from './dto/update-finance-conta-bancaria.dto';

@Injectable()
export class FinanceContaBancariaService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, createDto: CreateFinanceContaBancariaDto) {
    const { saldoInicial = 0, ...rest } = createDto;

    // Se marcou como principal, remove principal das outras
    if (createDto.principal) {
      await this.prisma.financeContaBancaria.updateMany({
        where: { usuarioId, principal: true },
        data: { principal: false },
      });
    }

    return this.prisma.financeContaBancaria.create({
      data: {
        ...rest,
        usuarioId,
        saldoInicial,
        saldoAtual: saldoInicial, // Saldo atual começa igual ao inicial
      },
    });
  }

  async findAll(usuarioId: number) {
    return this.prisma.financeContaBancaria.findMany({
      where: { usuarioId },
      orderBy: [
        { principal: 'desc' },
        { banco: 'asc' },
      ],
    });
  }

  async findOne(id: number, usuarioId: number) {
    const conta = await this.prisma.financeContaBancaria.findFirst({
      where: { id, usuarioId },
    });

    if (!conta) {
      throw new NotFoundException(`Conta bancária #${id} não encontrada`);
    }

    return conta;
  }

  async update(id: number, usuarioId: number, updateDto: UpdateFinanceContaBancariaDto) {
    await this.findOne(id, usuarioId);

    // Se marcou como principal, remove principal das outras
    if (updateDto.principal) {
      await this.prisma.financeContaBancaria.updateMany({
        where: { usuarioId, principal: true, id: { not: id } },
        data: { principal: false },
      });
    }

    return this.prisma.financeContaBancaria.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.financeContaBancaria.delete({
      where: { id },
    });
  }

  async getPrincipal(usuarioId: number) {
    return this.prisma.financeContaBancaria.findFirst({
      where: { usuarioId, principal: true, ativo: true },
    });
  }
}
