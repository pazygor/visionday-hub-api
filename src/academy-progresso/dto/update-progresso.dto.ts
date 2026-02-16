/**
 * VISIONDAY ACADEMY - PROGRESSO DTOs
 * Data Transfer Objects para o módulo de Progresso
 */

import { IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdateProgressoDto {
  @IsInt()
  aulaId: number;

  @IsOptional()
  @IsInt()
  ultimaPosicao?: number;

  @IsOptional()
  @IsInt()
  tempoAssistido?: number;

  @IsOptional()
  @IsBoolean()
  concluido?: boolean;
}

export class MarkAsCompleteDto {
  @IsInt()
  aulaId: number;
}
