/**
 * VISIONDAY ACADEMY - DASHBOARD DTOs
 */

export class DashboardStatsDto {
  cursosEmAndamento: number;
  cursosConcluidos: number;
  horasAssistidas: number;
  certificadosObtidos: number;
  progressoMedio: number;
  totalCursosMatriculados: number;
}

export class DashboardCourseDto {
  matriculaId: number;
  cursoId: number;
  cursoTitulo: string;
  cursoSlug: string;
  cursoThumbnail: string | null;
  categoriaNome: string;
  instrutorNome: string;
  progressoGeral: number;
  ultimaAulaId: number | null;
  dataUltimoAcesso: Date;
}

export class RecommendedCourseDto {
  id: number;
  titulo: string;
  slug: string;
  thumbnail: string | null;
  nivel: string;
  avaliacaoMedia: number;
  totalAlunos: number;
  categoriaNome: string;
  instrutorNome: string;
  duracao: number | null;
  preco: number | null;
}
