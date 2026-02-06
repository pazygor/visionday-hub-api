import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceContaReceberDto } from './create-finance-conta-receber.dto';
import { IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFinanceContaReceberDto extends PartialType(CreateFinanceContaReceberDto) {
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
