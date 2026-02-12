import { IsNumber, IsDateString, IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarPagamentoDto {
  @IsNumber()
  @Type(() => Number)
  valor: number;

  @IsDateString()
  dataPagamento: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  contaBancariaId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  formaPagamentoId?: number;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
