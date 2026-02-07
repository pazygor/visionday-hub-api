import { IsNumber, IsDateString, IsOptional, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarPagamentoDto {
  @IsNumber()
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  @Type(() => Number)
  valor: number;

  @IsDateString()
  dataPagamento: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  contaBancariaId?: number;

  @IsOptional()
  @IsString()
  formaPagamento?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
