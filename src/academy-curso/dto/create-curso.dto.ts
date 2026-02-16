import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray, Min } from 'class-validator';

export class CreateCursoDto {
  @IsNumber()
  categoriaId: number;

  @IsNumber()
  instrutorId: number;

  @IsString()
  titulo: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  descricaoCompleta?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  videoIntro?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  duracao?: number;

  @IsOptional()
  @IsEnum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'])
  nivel?: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';

  @IsOptional()
  @IsNumber()
  @Min(0)
  preco?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precoPromocional?: number;

  @IsOptional()
  @IsBoolean()
  gratuito?: boolean;

  @IsOptional()
  @IsBoolean()
  certificado?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cargaHoraria?: number;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  objetivos?: string[];

  @IsOptional()
  @IsArray()
  requisitos?: string[];

  @IsOptional()
  @IsArray()
  oqueLearned?: string[];

  @IsOptional()
  @IsBoolean()
  publicado?: boolean;

  @IsOptional()
  @IsBoolean()
  destaque?: boolean;
}
