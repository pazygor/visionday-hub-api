import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceClienteDto } from './dto/create-finance-cliente.dto';
import { UpdateFinanceClienteDto } from './dto/update-finance-cliente.dto';

@Injectable()
export class FinanceClienteService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, createDto: CreateFinanceClienteDto) {
    return this.prisma.financeCliente.create({
      data: {
        ...createDto,
        usuarioId,
      },
    });
  }

  async findAll(usuarioId: number, apenasAtivos: boolean = true) {
    return this.prisma.financeCliente.findMany({
      where: {
        usuarioId,
        ...(apenasAtivos && { ativo: true }),
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const cliente = await this.prisma.financeCliente.findFirst({
      where: { id, usuarioId },
      include: {
        contasReceber: {
          take: 10,
          orderBy: { dataVencimento: 'desc' },
        },
        faturas: {
          take: 10,
          orderBy: { dataEmissao: 'desc' },
        },
      },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente #${id} não encontrado`);
    }

    return cliente;
  }

  async update(id: number, usuarioId: number, updateDto: UpdateFinanceClienteDto) {
    await this.findOne(id, usuarioId);

    return this.prisma.financeCliente.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.financeCliente.delete({
      where: { id },
    });
  }

  async search(usuarioId: number, termo: string) {
    return this.prisma.financeCliente.findMany({
      where: {
        usuarioId,
        ativo: true,
        OR: [
          { nome: { contains: termo } },
          { email: { contains: termo } },
          { cpfCnpj: { contains: termo } },
        ],
      },
      orderBy: { nome: 'asc' },
      take: 10,
    });
  }
}
