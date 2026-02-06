import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceCategoriaDto } from './dto/create-finance-categoria.dto';
import { UpdateFinanceCategoriaDto } from './dto/update-finance-categoria.dto';

@Injectable()
export class FinanceCategoriaService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, createDto: CreateFinanceCategoriaDto) {
    return this.prisma.financeCategoria.create({
      data: {
        ...createDto,
        usuarioId,
      },
    });
  }

  async findAll(usuarioId: number) {
    // Retorna categorias globais (usuarioId null) + categorias do usuário
    return this.prisma.financeCategoria.findMany({
      where: {
        OR: [
          { usuarioId: null }, // Categorias globais
          { usuarioId }, // Categorias do usuário
        ],
      },
      orderBy: [
        { tipo: 'asc' },
        { nome: 'asc' },
      ],
    });
  }

  async findOne(id: number, usuarioId: number) {
    const categoria = await this.prisma.financeCategoria.findFirst({
      where: {
        id,
        OR: [
          { usuarioId: null },
          { usuarioId },
        ],
      },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria #${id} não encontrada`);
    }

    return categoria;
  }

  async update(id: number, usuarioId: number, updateDto: UpdateFinanceCategoriaDto) {
    // Verifica se existe e pertence ao usuário (não pode editar categorias globais)
    const categoria = await this.prisma.financeCategoria.findFirst({
      where: {
        id,
        usuarioId, // Só pode editar suas próprias categorias
      },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria #${id} não encontrada ou não pode ser editada`);
    }

    return this.prisma.financeCategoria.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number, usuarioId: number) {
    // Verifica se existe e pertence ao usuário
    const categoria = await this.prisma.financeCategoria.findFirst({
      where: {
        id,
        usuarioId,
      },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria #${id} não encontrada ou não pode ser removida`);
    }

    return this.prisma.financeCategoria.delete({
      where: { id },
    });
  }

  async findByTipo(usuarioId: number, tipo: 'RECEITA' | 'DESPESA') {
    return this.prisma.financeCategoria.findMany({
      where: {
        tipo,
        OR: [
          { usuarioId: null },
          { usuarioId },
        ],
      },
      orderBy: { nome: 'asc' },
    });
  }
}
