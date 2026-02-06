import { IsString, IsNumber, IsOptional, IsInt, IsBoolean, IsDateString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFinanceContaReceberDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  clienteId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoriaId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  contaBancariaId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  formaPagamentoId?: number;

  @IsString()
  @MaxLength(255)
  descricao: string;

  @IsNumber()
  @Type(() => Number)
  valorTotal: number;

  @IsDateString()
  dataEmissao: string;

  @IsDateString()
  dataVencimento: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  numeroParcelas?: number;

  @IsOptional()
  @IsBoolean()
  recorrente?: boolean;

  @IsOptional()
  @IsString()
  frequenciaRecorrencia?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
