import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceFornecedorDto } from './create-finance-fornecedor.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateFinanceFornecedorDto extends PartialType(CreateFinanceFornecedorDto) {
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
