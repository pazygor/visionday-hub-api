import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto, UpdateCursoDto, CursoFilterDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AcademyCursoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Listar cursos com filtros, busca e paginação
   */
  async findAll(filters: CursoFilterDto) {
    const {
      busca,
      categoriaId,
      nivel,
      gratuito,
      precoMin,
      precoMax,
      publicado = true,
      destaque,
      ordenarPor,
      ordem,
      page = 1,
      limit = 12,
    } = filters;

    // Construir condições de filtro
    const where: any = {
      ativo: true,
      publicado,
    };

    // Filtro de busca (título e descrição)
    if (busca) {
      where.OR = [
        { titulo: { contains: busca } },
        { descricao: { contains: busca } },
        { descricaoCompleta: { contains: busca } },
      ];
    }

    // Filtro por categoria
    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    // Filtro por nível
    if (nivel) {
      where.nivel = nivel;
    }

    // Filtro por gratuito/pago
    if (typeof gratuito === 'boolean') {
      where.gratuito = gratuito;
    }

    // Filtro por faixa de preço
    if (precoMin !== undefined || precoMax !== undefined) {
      where.preco = {};
      if (precoMin !== undefined) {
        where.preco.gte = precoMin;
      }
      if (precoMax !== undefined) {
        where.preco.lte = precoMax;
      }
    }

    // Filtro por destaque
    if (typeof destaque === 'boolean') {
      where.destaque = destaque;
    }

    // Definir ordenação
    const ordemDirecao = ordem || 'desc';
    let orderBy: any = {};
    
    switch (ordenarPor) {
      case 'popular':
        orderBy = { totalAlunos: ordemDirecao };
        break;
      case 'avaliacao':
        orderBy = { avaliacaoMedia: ordemDirecao };
        break;
      case 'titulo':
        orderBy = { titulo: ordemDirecao };
        break;
      case 'preco':
        orderBy = { preco: ordemDirecao };
        break;
      case 'recente':
      default:
        orderBy = { createdAt: ordemDirecao };
        break;
    }

    // Calcular paginação
    const skip = (page - 1) * limit;

    // Buscar cursos
    const [cursos, total] = await Promise.all([
      this.prisma.academyCurso.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          categoria: {
            select: {
              id: true,
              nome: true,
              slug: true,
              icone: true,
              cor: true,
            },
          },
          instrutor: {
            select: {
              id: true,
              nome: true,
              foto: true,
            },
          },
          _count: {
            select: {
              modulos: true,
              matriculas: true,
            },
          },
        },
      }),
      this.prisma.academyCurso.count({ where }),
    ]);

    return {
      data: cursos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar curso por ID
   */
  async findOne(id: number) {
    const curso = await this.prisma.academyCurso.findUnique({
      where: { id },
      include: {
        categoria: true,
        instrutor: true,
        _count: {
          select: {
            modulos: true,
            matriculas: true,
            avaliacoes: true,
          },
        },
      },
    });

    if (!curso) {
      throw new NotFoundException(`Curso com ID ${id} não encontrado`);
    }

    return curso;
  }

  /**
   * Buscar curso por slug (para página de detalhes)
   */
  async findBySlug(slug: string) {
    const curso = await this.prisma.academyCurso.findUnique({
      where: { slug },
      include: {
        categoria: true,
        instrutor: true,
        modulos: {
          where: { ativo: true },
          orderBy: { ordem: 'asc' },
          include: {
            aulas: {
              where: { ativo: true },
              orderBy: { ordem: 'asc' },
              select: {
                id: true,
                titulo: true,
                descricao: true,
                tipo: true,
                duracao: true,
                ordem: true,
                gratuita: true,
              },
            },
          },
        },
        _count: {
          select: {
            matriculas: true,
            avaliacoes: true,
          },
        },
      },
    });

    if (!curso) {
      throw new NotFoundException(`Curso com slug "${slug}" não encontrado`);
    }

    return curso;
  }

  /**
   * Buscar cursos em destaque
   */
  async findDestaque(limit: number = 6) {
    return this.prisma.academyCurso.findMany({
      where: {
        ativo: true,
        publicado: true,
        destaque: true,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            slug: true,
            cor: true,
          },
        },
        instrutor: {
          select: {
            id: true,
            nome: true,
            foto: true,
          },
        },
      },
    });
  }

  /**
   * Criar novo curso
   */
  async create(createCursoDto: CreateCursoDto) {
    const { tags, objetivos, requisitos, oqueLearned, ...restData } = createCursoDto;

    return this.prisma.academyCurso.create({
      data: {
        ...restData,
        tags: tags ? JSON.stringify(tags) : null,
        objetivos: objetivos ? JSON.stringify(objetivos) : null,
        requisitos: requisitos ? JSON.stringify(requisitos) : null,
        oqueLearned: oqueLearned ? JSON.stringify(oqueLearned) : null,
      },
      include: {
        categoria: true,
        instrutor: true,
      },
    });
  }

  /**
   * Atualizar curso
   */
  async update(id: number, updateCursoDto: UpdateCursoDto) {
    // Verificar se o curso existe
    await this.findOne(id);

    const { tags, objetivos, requisitos, oqueLearned, ...restData } = updateCursoDto;

    return this.prisma.academyCurso.update({
      where: { id },
      data: {
        ...restData,
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(objetivos !== undefined && { objetivos: JSON.stringify(objetivos) }),
        ...(requisitos !== undefined && { requisitos: JSON.stringify(requisitos) }),
        ...(oqueLearned !== undefined && { oqueLearned: JSON.stringify(oqueLearned) }),
      },
      include: {
        categoria: true,
        instrutor: true,
      },
    });
  }

  /**
   * Deletar curso (soft delete)
   */
  async remove(id: number) {
    // Verificar se o curso existe
    await this.findOne(id);

    return this.prisma.academyCurso.update({
      where: { id },
      data: { ativo: false },
    });
  }

  /**
   * Publicar/Despublicar curso
   */
  async togglePublicado(id: number) {
    const curso = await this.findOne(id);

    return this.prisma.academyCurso.update({
      where: { id },
      data: {
        publicado: !curso.publicado,
        dataPublicacao: !curso.publicado ? new Date() : null,
      },
    });
  }

  /**
   * Marcar/Desmarcar curso como destaque
   */
  async toggleDestaque(id: number) {
    const curso = await this.findOne(id);

    return this.prisma.academyCurso.update({
      where: { id },
      data: { destaque: !curso.destaque },
    });
  }
}
