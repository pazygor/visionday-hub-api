/**
 * VISIONDAY ACADEMY - CERTIFICADO DTOs
 */

import { IsInt } from 'class-validator';

export class GenerateCertificadoDto {
  @IsInt()
  matriculaId: number;
}

export class ValidateCertificadoDto {
  codigo: string;
  valido: boolean;
  dataEmissao?: Date;
  usuarioNome?: string;
  cursoTitulo?: string;
  cargaHoraria?: number;
}
