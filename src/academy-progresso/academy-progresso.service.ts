/**
 * VISIONDAY ACADEMY - PROGRESSO SERVICE
 * Serviço para gerenciamento de progresso de aulas
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AcademyCertificadoService } from '../academy-certificado/academy-certificado.service';
import {
  UpdateProgressoDto,
  MarkAsCompleteDto,
  ProgressoResponseDto,
  CursoProgressoDto,
  ProximaAulaDto,
  ProgressoAulaDto,
} from './dto';

@Injectable()
export class AcademyProgressoService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AcademyCertificadoService))
    private certificadoService: AcademyCertificadoService,
  ) {}

  /**
   * Atualizar ou criar progresso de uma aula
   */
  async updateProgress(
    usuarioId: number,
    matriculaId: number,
    updateProgressoDto: UpdateProgressoDto,
  ): Promise<ProgressoResponseDto> {
    const { aulaId, ultimaPosicao, tempoAssistido, concluido } = updateProgressoDto;

    // Verificar se a matrícula pertence ao usuário
    const matricula = await this.prisma.academyMatricula.findFirst({
      where: {
        id: matriculaId,
        usuarioId,
        status: 'ATIVA',
      },
    });

    if (!matricula) {
      throw new ForbiddenException('Matrícula não encontrada ou inativa');
    }

    // Verificar se a aula existe e pertence ao curso da matrícula
    const aula = await this.prisma.academyAula.findFirst({
      where: {
        id: aulaId,
        modulo: {
          cursoId: matricula.cursoId,
        },
      },
    });

    if (!aula) {
      throw new NotFoundException('Aula não encontrada');
    }

    // Buscar ou criar progresso
    let progresso = await this.prisma.academyProgresso.findUnique({
      where: {
        matriculaId_aulaId: {
          matriculaId,
          aulaId,
        },
      },
    });

    const now = new Date();

    if (progresso) {
      // Atualizar progresso existente
      progresso = await this.prisma.academyProgresso.update({
        where: { id: progresso.id },
        data: {
          ultimaPosicao: ultimaPosicao ?? progresso.ultimaPosicao,
          tempoAssistido: tempoAssistido ?? progresso.tempoAssistido,
          concluido: concluido ?? progresso.concluido,
          dataConclusao: concluido ? now : progresso.dataConclusao,
        },
      });
    } else {
      // Criar novo progresso
      progresso = await this.prisma.academyProgresso.create({
        data: {
          matriculaId,
          aulaId,
          ultimaPosicao: ultimaPosicao || 0,
          tempoAssistido: tempoAssistido || 0,
          concluido: concluido || false,
          dataInicio: now,
          dataConclusao: concluido ? now : null,
        },
      });

      // Se é a primeira aula assistida, atualizar dataInicio da matrícula
      if (!matricula.dataInicio) {
        await this.prisma.academyMatricula.update({
          where: { id: matriculaId },
          data: { dataInicio: now },
        });
      }
    }

    // Atualizar última aula assistida na matrícula
    await this.prisma.academyMatricula.update({
      where: { id: matriculaId },
      data: { ultimaAulaId: aulaId },
    });

    // Recalcular progresso geral
    await this.recalcularProgressoGeral(matriculaId);

    return {
      aulaId: progresso.aulaId,
      concluido: progresso.concluido,
      tempoAssistido: progresso.tempoAssistido,
      ultimaPosicao: progresso.ultimaPosicao,
      dataInicio: progresso.dataInicio,
      dataConclusao: progresso.dataConclusao,
    };
  }

  /**
   * Marcar aula como concluída
   */
  async markAsComplete(
    usuarioId: number,
    matriculaId: number,
    markAsCompleteDto: MarkAsCompleteDto,
  ): Promise<ProgressoResponseDto> {
    return this.updateProgress(usuarioId, matriculaId, {
      aulaId: markAsCompleteDto.aulaId,
      concluido: true,
    });
  }

  /**
   * Obter progresso completo de um curso
   */
  async getCourseProgress(usuarioId: number, matriculaId: number): Promise<CursoProgressoDto> {
    const matricula = await this.prisma.academyMatricula.findFirst({
      where: {
        id: matriculaId,
        usuarioId,
      },
      include: {
        curso: {
          include: {
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
        progressos: true,
      },
    });

    if (!matricula) {
      throw new NotFoundException('Matrícula não encontrada');
    }

    // Contar total de aulas
    const totalAulas = matricula.curso.modulos.reduce(
      (acc, modulo) => acc + modulo.aulas.length,
      0,
    );

    // Contar aulas completas
    const aulasCompletas = matricula.progressos.filter((p) => p.concluido).length;

    // Montar lista de aulas com progresso
    const aulas: ProgressoAulaDto[] = [];
    for (const modulo of matricula.curso.modulos) {
      for (const aula of modulo.aulas) {
        const progresso = matricula.progressos.find((p) => p.aulaId === aula.id);
        aulas.push({
          aulaId: aula.id,
          moduloId: modulo.id,
          moduloTitulo: modulo.titulo,
          aulaTitulo: aula.titulo,
          concluido: progresso?.concluido || false,
          ultimaPosicao: progresso?.ultimaPosicao || 0,
          ordem: aula.ordem,
        });
      }
    }

    return {
      matriculaId: matricula.id,
      cursoId: matricula.cursoId,
      progressoGeral: matricula.progressoGeral,
      totalAulas,
      aulasCompletas,
      tempoAssistido: matricula.tempoAssistido,
      aulas,
    };
  }

  /**
   * Obter progresso de uma aula específica
   */
  async getLessonProgress(
    usuarioId: number,
    matriculaId: number,
    aulaId: number,
  ): Promise<ProgressoResponseDto | null> {
    // Verificar se a matrícula pertence ao usuário
    const matricula = await this.prisma.academyMatricula.findFirst({
      where: {
        id: matriculaId,
        usuarioId,
      },
    });

    if (!matricula) {
      throw new ForbiddenException('Matrícula não encontrada');
    }

    const progresso = await this.prisma.academyProgresso.findUnique({
      where: {
        matriculaId_aulaId: {
          matriculaId,
          aulaId,
        },
      },
    });

    if (!progresso) {
      return null;
    }

    return {
      aulaId: progresso.aulaId,
      concluido: progresso.concluido,
      tempoAssistido: progresso.tempoAssistido,
      ultimaPosicao: progresso.ultimaPosicao,
      dataInicio: progresso.dataInicio,
      dataConclusao: progresso.dataConclusao,
    };
  }

  /**
   * Obter próxima aula a ser assistida
   */
  async getNextLesson(usuarioId: number, matriculaId: number): Promise<ProximaAulaDto | null> {
    const matricula = await this.prisma.academyMatricula.findFirst({
      where: {
        id: matriculaId,
        usuarioId,
      },
      include: {
        curso: {
          include: {
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
        progressos: true,
      },
    });

    if (!matricula) {
      throw new NotFoundException('Matrícula não encontrada');
    }

    // Encontrar primeira aula não concluída
    for (const modulo of matricula.curso.modulos) {
      for (const aula of modulo.aulas) {
        const progresso = matricula.progressos.find((p) => p.aulaId === aula.id);
        if (!progresso || !progresso.concluido) {
          return {
            aulaId: aula.id,
            moduloId: modulo.id,
            titulo: aula.titulo,
            tipo: aula.tipo,
            duracao: aula.duracao,
            conteudoUrl: aula.conteudoUrl,
          };
        }
      }
    }

    return null;
  }

  /**
   * Recalcular progresso geral do curso
   */
  private async recalcularProgressoGeral(matriculaId: number): Promise<void> {
    const matricula = await this.prisma.academyMatricula.findUnique({
      where: { id: matriculaId },
      include: {
        curso: {
          include: {
            modulos: {
              where: { ativo: true },
              include: {
                aulas: {
                  where: { ativo: true },
                },
              },
            },
          },
        },
        progressos: true,
      },
    });

    if (!matricula) return;

    // Contar total de aulas
    const totalAulas = matricula.curso.modulos.reduce(
      (acc, modulo) => acc + modulo.aulas.length,
      0,
    );

    if (totalAulas === 0) return;

    // Contar aulas concluídas
    const aulasCompletas = matricula.progressos.filter((p) => p.concluido).length;

    // Calcular percentual
    const progressoGeral = Math.round((aulasCompletas / totalAulas) * 100);

    // Calcular tempo total assistido
    const tempoAssistido = matricula.progressos.reduce(
      (acc, p) => acc + p.tempoAssistido,
      0,
    );

    const statusAnterior = matricula.status;
    const novoStatus = progressoGeral === 100 ? 'CONCLUIDA' : 'ATIVA';

    // Atualizar matrícula
    await this.prisma.academyMatricula.update({
      where: { id: matriculaId },
      data: {
        progressoGeral,
        tempoAssistido,
        status: novoStatus,
        dataConclusao: progressoGeral === 100 ? new Date() : null,
      },
    });

    // Emitir certificado automaticamente se acabou de concluir
    if (progressoGeral === 100 && statusAnterior !== 'CONCLUIDA') {
      try {
        await this.certificadoService.autoGenerate(matriculaId);
      } catch (error) {
        console.error('Erro ao gerar certificado automaticamente:', error);
        // Não bloqueia o fluxo se houver erro na geração do certificado
      }
    }
  }
}
