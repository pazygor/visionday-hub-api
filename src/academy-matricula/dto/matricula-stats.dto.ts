/**
 * VISIONDAY ACADEMY - MATRICULA STATS DTOs
 * DTOs para estatísticas de matrículas
 */

export class MatriculaStatsDto {
  cursosEmAndamento: number;
  cursosConcluidos: number;
  horasAssistidas: number;
  certificadosObtidos: number;
  progressoMedio: number;
}

export class ContinueWatchingDto {
  matriculaId: number;
  cursoId: number;
  cursoTitulo: string;
  cursoThumbnail: string;
  cursoSlug: string;
  progressoGeral: number;
  ultimaAulaId: number | null;
  ultimaAulaTitulo: string | null;
  dataUltimoAcesso: Date;
}
