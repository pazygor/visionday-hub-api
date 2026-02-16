/**
 * VISIONDAY ACADEMY - MATRICULA DTOs
 * Data Transfer Objects para o módulo de Matrículas
 */

import { IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateMatriculaDto {
  @IsInt()
  cursoId: number;
}

export class UpdateMatriculaDto {
  @IsOptional()
  @IsBoolean()
  favorito?: boolean;
}
