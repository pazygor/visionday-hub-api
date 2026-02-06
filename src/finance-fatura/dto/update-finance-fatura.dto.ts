import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceFaturaDto } from './create-finance-fatura.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateFinanceFaturaDto extends PartialType(CreateFinanceFaturaDto) {
  @IsOptional()
  @IsEnum(['PENDENTE', 'PAGA', 'VENCIDA', 'CANCELADA'])
  status?: string;
}
