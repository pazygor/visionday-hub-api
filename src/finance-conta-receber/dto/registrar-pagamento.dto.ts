import { IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarPagamentoDto {
  @IsNumber()
  @Type(() => Number)
  valor: number;

  @IsDateString()
  dataPagamento: string;
}
