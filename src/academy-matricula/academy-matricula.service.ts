/**
 * VISIONDAY ACADEMY - MATRICULA SERVICE
 * Serviço para gerenciamento de matrículas
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMatriculaDto,
  UpdateMatriculaDto,
  MatriculaStatsDto,
  ContinueWatchingDto,
  DashboardStatsDto,
  DashboardCourseDto,
  RecommendedCourseDto,
} from './dto';

@Injectable()
export class AcademyMatriculaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar nova matrícula
   */
  async create(usuarioId: number, createMatriculaDto: CreateMatriculaDto) {
    const { cursoId } = createMatriculaDto;

    // Verificar se o curso existe e está publicado
    const curso = await this.prisma.academyCurso.findUnique({
      where: { id: cursoId },
    });

    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (!curso.publicado || !curso.ativo) {
      throw new BadRequestException('Este curso não está disponível para matrícula');
    }

    // Verificar se já existe matrícula ativa
    const matriculaExistente = await this.prisma.academyMatricula.findUnique({
      where: {
        usuarioId_cursoId: {
          usuarioId,
          cursoId,
        },
      },
    });

    if (matriculaExistente) {
      if (matriculaExistente.status === 'ATIVA') {
        throw new ConflictException('Você já está matriculado neste curso');
      }
      
      // Reativar matrícula cancelada
      return this.prisma.academyMatricula.update({
        where: { id: matriculaExistente.id },
        data: {
          status: 'ATIVA',
          dataMatricula: new Date(),
        },
        include: {
          curso: {
            include: {
              categoria: true,
              instrutor: true,
            },
          },
        },
      });
    }

    // Criar nova matrícula
    const matricula = await this.prisma.academyMatricula.create({
      data: {
        usuarioId,
        cursoId,
        status: 'ATIVA',
      },
      include: {
        curso: {
          include: {
            categoria: true,
            instrutor: true,
          },
        },
      },
    });

    // Incrementar contador de alunos do curso
    await this.prisma.academyCurso.update({
      where: { id: cursoId },
      data: {
        totalAlunos: {
          increment: 1,
        },
      },
    });

    return matricula;
  }

  /**
   * Buscar todas as matrículas do usuário
   */
  async findAll(usuarioId: number, status?: string, favorito?: boolean) {
    const where: any = { usuarioId };

    if (status) {
      where.status = status;
    }

    if (favorito !== undefined) {
      where.favorito = favorito;
    }

    return this.prisma.academyMatricula.findMany({
      where,
      include: {
        curso: {
          include: {
            categoria: true,
            instrutor: true,
          },
        },
      },
      orderBy: {
        dataMatricula: 'desc',
      },
    });
  }

  /**
   * Buscar matrícula específica
   */
  async findOne(id: number, usuarioId: number) {
    const matricula = await this.prisma.academyMatricula.findFirst({
      where: {
        id,
        usuarioId,
      },
      include: {
        curso: {
          include: {
            categoria: true,
            instrutor: true,
            modulos: {
              where: { ativo: true },
              include: {
                aulas: {
                  where: { ativo: true },
                  orderBy: { ordem: 'asc' },
                },
              },
              orderBy: { ordem: 'asc' },
            },
          },
        },
        progressos: {
          include: {
            aula: true,
          },
        },
      },
    });

    if (!matricula) {
      throw new NotFoundException('Matrícula não encontrada');
    }

    return matricula;
  }

  /**
   * Atualizar matrícula (favorito, etc)
   */
  async update(id: number, usuarioId: number, updateMatriculaDto: UpdateMatriculaDto) {
    const matricula = await this.prisma.academyMatricula.findFirst({
      where: { id, usuarioId },
    });

    if (!matricula) {
      throw new NotFoundException('Matrícula não encontrada');
    }

    return this.prisma.academyMatricula.update({
      where: { id },
      data: updateMatriculaDto,
      include: {
        curso: {
          include: {
            categoria: true,
            instrutor: true,
          },
        },
      },
    });
  }

  /**
   * Cancelar matrícula
   */
  async remove(id: number, usuarioId: number) {
    const matricula = await this.prisma.academyMatricula.findFirst({
      where: { id, usuarioId },
    });

    if (!matricula) {
      throw new NotFoundException('Matrícula não encontrada');
    }

    return this.prisma.academyMatricula.update({
      where: { id },
      data: {
        status: 'CANCELADA',
      },
    });
  }

  /**
   * Estatísticas do usuário
   */
  async getStats(usuarioId: number): Promise<MatriculaStatsDto> {
    const [
      cursosEmAndamento,
      cursosConcluidos,
      tempoTotal,
      certificados,
    ] = await Promise.all([
      // Cursos em andamento
      this.prisma.academyMatricula.count({
        where: {
          usuarioId,
          status: 'ATIVA',
        },
      }),
      // Cursos concluídos
      this.prisma.academyMatricula.count({
        where: {
          usuarioId,
          status: 'CONCLUIDA',
        },
      }),
      // Tempo total assistido
      this.prisma.academyMatricula.aggregate({
        where: { usuarioId },
        _sum: {
          tempoAssistido: true,
        },
      }),
      // Certificados obtidos
      this.prisma.academyCertificado.count({
        where: {
          usuarioId,
          ativo: true,
        },
      }),
    ]);

    const tempoAssistidoSegundos = tempoTotal._sum.tempoAssistido || 0;
    const horasAssistidas = Math.floor(tempoAssistidoSegundos / 3600);

    // Calcular progresso médio
    const matriculas = await this.prisma.academyMatricula.findMany({
      where: {
        usuarioId,
        status: 'ATIVA',
      },
      select: {
        progressoGeral: true,
      },
    });

    const progressoMedio = matriculas.length > 0
      ? Math.round(
          matriculas.reduce((acc, m) => acc + m.progressoGeral, 0) / matriculas.length
        )
      : 0;

    return {
      cursosEmAndamento,
      cursosConcluidos,
      horasAssistidas,
      certificadosObtidos: certificados,
      progressoMedio,
    };
  }

  /**
   * Continuar assistindo - últimos cursos acessados
   */
  async getContinueWatching(usuarioId: number, limit: number = 3): Promise<ContinueWatchingDto[]> {
    const matriculas = await this.prisma.academyMatricula.findMany({
      where: {
        usuarioId,
        status: 'ATIVA',
        progressoGeral: {
          gt: 0,
          lt: 100,
        },
      },
      include: {
        curso: {
          select: {
            id: true,
            titulo: true,
            thumbnail: true,
            slug: true,
          },
        },
        progressos: {
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        dataMatricula: 'desc',
      },
      take: limit,
    });

    return matriculas.map((m) => {
      const ultimoProgresso = m.progressos[0];
      return {
        matriculaId: m.id,
        cursoId: m.cursoId,
        cursoTitulo: m.curso.titulo,
        cursoThumbnail: m.curso.thumbnail || '',
        cursoSlug: m.curso.slug,
        progressoGeral: m.progressoGeral,
        ultimaAulaId: m.ultimaAulaId,
        ultimaAulaTitulo: null, // TODO: buscar título da aula
        dataUltimoAcesso: ultimoProgresso?.updatedAt || m.dataMatricula,
      };
    });
  }

  /**
   * Verificar se usuário está matriculado em um curso
   */
  async isEnrolled(usuarioId: number, cursoId: number): Promise<boolean> {
    const matricula = await this.prisma.academyMatricula.findUnique({
      where: {
        usuarioId_cursoId: {
          usuarioId,
          cursoId,
        },
      },
    });

    return matricula?.status === 'ATIVA';
  }

  /**
   * Obter matrícula por curso
   */
  async getByUserAndCourse(usuarioId: number, cursoId: number) {
    const matricula = await this.prisma.academyMatricula.findUnique({
      where: {
        usuarioId_cursoId: {
          usuarioId,
          cursoId,
        },
      },
      include: {
        curso: {
          include: {
            categoria: true,
            instrutor: true,
          },
        },
      },
    });

    if (!matricula) {
      throw new NotFoundException('Matrícula não encontrada');
    }

    return matricula;
  }

  /**
   * Dashboard: Estatísticas completas do usuário
   */
  async getDashboardStats(usuarioId: number): Promise<DashboardStatsDto> {
    const stats = await this.getStats(usuarioId);
    
    const totalMatriculados = await this.prisma.academyMatricula.count({
      where: { usuarioId },
    });

    return {
      ...stats,
      totalCursosMatriculados: totalMatriculados,
    };
  }

  /**
   * Dashboard: Cursos para continuar assistindo
   */
  async getDashboardContinueWatching(
    usuarioId: number,
    limit: number = 4,
  ): Promise<DashboardCourseDto[]> {
    const matriculas = await this.prisma.academyMatricula.findMany({
      where: {
        usuarioId,
        status: 'ATIVA',
        progressoGeral: {
          gt: 0,
          lt: 100,
        },
      },
      include: {
        curso: {
          include: {
            categoria: true,
            instrutor: true,
          },
        },
        progressos: {
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        dataMatricula: 'desc',
      },
      take: limit,
    });

    return matriculas.map((m) => ({
      matriculaId: m.id,
      cursoId: m.cursoId,
      cursoTitulo: m.curso.titulo,
      cursoSlug: m.curso.slug,
      cursoThumbnail: m.curso.thumbnail,
      categoriaNome: m.curso.categoria?.nome || '',
      instrutorNome: m.curso.instrutor?.nome || '',
      progressoGeral: m.progressoGeral,
      ultimaAulaId: m.ultimaAulaId,
      dataUltimoAcesso: m.progressos[0]?.updatedAt || m.dataMatricula,
    }));
  }

  /**
   * Dashboard: Cursos recomendados
   */
  async getRecommendedCourses(usuarioId: number, limit: number = 4): Promise<RecommendedCourseDto[]> {
    // Buscar categorias dos cursos que o usuário já fez
    const matriculas = await this.prisma.academyMatricula.findMany({
      where: { usuarioId },
      include: {
        curso: {
          select: {
            categoriaId: true,
          },
        },
      },
    });

    const categoriaIds = [...new Set(matriculas.map((m) => m.curso.categoriaId))];

    // IDs dos cursos já matriculados
    const cursosMatriculadosIds = matriculas.map((m) => m.cursoId);

    // Buscar cursos recomendados (mesma categoria, não matriculado, bem avaliados)
    const cursos = await this.prisma.academyCurso.findMany({
      where: {
        publicado: true,
        ativo: true,
        id: {
          notIn: cursosMatriculadosIds.length > 0 ? cursosMatriculadosIds : undefined,
        },
        ...(categoriaIds.length > 0 && {
          categoriaId: {
            in: categoriaIds,
          },
        }),
      },
      include: {
        categoria: true,
        instrutor: true,
      },
      orderBy: [
        { avaliacaoMedia: 'desc' },
        { totalAlunos: 'desc' },
      ],
      take: limit,
    });

    // Se não encontrar cursos nas categorias do usuário, buscar os mais populares
    if (cursos.length === 0) {
      const cursosPopulares = await this.prisma.academyCurso.findMany({
        where: {
          publicado: true,
          ativo: true,
          id: {
            notIn: cursosMatriculadosIds.length > 0 ? cursosMatriculadosIds : undefined,
          },
        },
        include: {
          categoria: true,
          instrutor: true,
        },
        orderBy: [
          { totalAlunos: 'desc' },
          { avaliacaoMedia: 'desc' },
        ],
        take: limit,
      });

      return cursosPopulares.map((c) => ({
        id: c.id,
        titulo: c.titulo,
        slug: c.slug,
        thumbnail: c.thumbnail,
        nivel: c.nivel,
        avaliacaoMedia: Number(c.avaliacaoMedia) || 0,
        totalAlunos: c.totalAlunos,
        categoriaNome: c.categoria?.nome || '',
        instrutorNome: c.instrutor?.nome || '',
        duracao: c.duracao,
        preco: c.preco ? Number(c.preco) : null,
      }));
    }

    return cursos.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      slug: c.slug,
      thumbnail: c.thumbnail,
      nivel: c.nivel,
      avaliacaoMedia: Number(c.avaliacaoMedia) || 0,
      totalAlunos: c.totalAlunos,
      categoriaNome: c.categoria?.nome || '',
      instrutorNome: c.instrutor?.nome || '',
      duracao: c.duracao,
      preco: c.preco ? Number(c.preco) : null,
    }));
  }
}
