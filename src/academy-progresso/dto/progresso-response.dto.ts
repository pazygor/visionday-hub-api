/**
 * VISIONDAY ACADEMY - PROGRESSO RESPONSE DTOs
 */

export class ProgressoResponseDto {
  aulaId: number;
  concluido: boolean;
  tempoAssistido: number;
  ultimaPosicao: number;
  dataInicio: Date | null;
  dataConclusao: Date | null;
}

export class CursoProgressoDto {
  matriculaId: number;
  cursoId: number;
  progressoGeral: number; // 0-100
  totalAulas: number;
  aulasCompletas: number;
  tempoAssistido: number; // em segundos
  aulas: ProgressoAulaDto[];
}

export class ProgressoAulaDto {
  aulaId: number;
  moduloId: number;
  moduloTitulo: string;
  aulaTitulo: string;
  concluido: boolean;
  ultimaPosicao: number;
  ordem: number;
}

export class ProximaAulaDto {
  aulaId: number;
  moduloId: number;
  titulo: string;
  tipo: string;
  duracao: number | null;
  conteudoUrl: string | null;
}
