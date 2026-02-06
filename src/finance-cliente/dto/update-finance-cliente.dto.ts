import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceClienteDto } from './create-finance-cliente.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateFinanceClienteDto extends PartialType(CreateFinanceClienteDto) {
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
