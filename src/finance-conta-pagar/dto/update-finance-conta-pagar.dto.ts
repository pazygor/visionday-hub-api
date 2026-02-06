import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceContaPagarDto } from './create-finance-conta-pagar.dto';
import { IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFinanceContaPagarDto extends PartialType(CreateFinanceContaPagarDto) {
  @IsOptional()
  @IsEnum(['PENDENTE', 'PAGA', 'VENCIDA', 'CANCELADA', 'PARCIALMENTE_PAGA'])
  status?: string;

  @IsOptional()
  @IsDateString()
  dataPagamento?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  valorPago?: number;
}
