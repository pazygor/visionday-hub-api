import { IsString, IsNumber, IsOptional, IsInt, IsDateString, MaxLength, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFinanceFaturaDto {
  @IsInt()
  @Type(() => Number)
  clienteId: number;

  @IsDateString()
  dataEmissao: string;

  @IsDateString()
  dataVencimento: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;

  @IsArray()
  itens: Array<{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
  }>;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  desconto?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  acrescimo?: number;

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
}
