import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceFornecedorDto } from './dto/create-finance-fornecedor.dto';
import { UpdateFinanceFornecedorDto } from './dto/update-finance-fornecedor.dto';

@Injectable()
export class FinanceFornecedorService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, createDto: CreateFinanceFornecedorDto) {
    return this.prisma.financeFornecedor.create({
      data: {
        ...createDto,
        usuarioId,
      },
    });
  }

  async findAll(usuarioId: number, apenasAtivos: boolean = true) {
    return this.prisma.financeFornecedor.findMany({
      where: {
        usuarioId,
        ...(apenasAtivos && { ativo: true }),
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const fornecedor = await this.prisma.financeFornecedor.findFirst({
      where: { id, usuarioId },
      include: {
        contasPagar: {
          take: 10,
          orderBy: { dataVencimento: 'desc' },
        },
      },
    });

    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor #${id} não encontrado`);
    }

    return fornecedor;
  }

  async update(id: number, usuarioId: number, updateDto: UpdateFinanceFornecedorDto) {
    await this.findOne(id, usuarioId);

    return this.prisma.financeFornecedor.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.financeFornecedor.delete({
      where: { id },
    });
  }

  async search(usuarioId: number, termo: string) {
    return this.prisma.financeFornecedor.findMany({
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
