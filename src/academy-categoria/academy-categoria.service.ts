import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademyCategoriaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Listar todas as categorias ativas
   */
  async findAll() {
    return this.prisma.academyCategoria.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
      include: {
        _count: {
          select: {
            cursos: {
              where: {
                ativo: true,
                publicado: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Buscar categoria por ID
   */
  async findOne(id: number) {
    return this.prisma.academyCategoria.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            cursos: {
              where: {
                ativo: true,
                publicado: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Buscar categoria por slug
   */
  async findBySlug(slug: string) {
    return this.prisma.academyCategoria.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            cursos: {
              where: {
                ativo: true,
                publicado: true,
              },
            },
          },
        },
      },
    });
  }
}
