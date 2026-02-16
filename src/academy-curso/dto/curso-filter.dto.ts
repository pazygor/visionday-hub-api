import { IsOptional, IsString, IsEnum, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CursoFilterDto {
  @IsOptional()
  @IsString()
  busca?: string; // Busca no título e descrição

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoriaId?: number;

  @IsOptional()
  @IsEnum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'])
  nivel?: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  gratuito?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  precoMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  precoMax?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  publicado?: boolean = true; // Por padrão, retornar apenas cursos publicados

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  destaque?: boolean;

  @IsOptional()
  @IsEnum(['recente', 'popular', 'avaliacao', 'titulo', 'preco'])
  ordenarPor?: 'recente' | 'popular' | 'avaliacao' | 'titulo' | 'preco';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  ordem?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 12;
}
