import { IsString, IsEnum, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateFinanceCategoriaDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsEnum(['RECEITA', 'DESPESA'])
  tipo: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  cor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icone?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
