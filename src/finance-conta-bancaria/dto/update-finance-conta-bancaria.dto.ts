import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceContaBancariaDto } from './create-finance-conta-bancaria.dto';

export class UpdateFinanceContaBancariaDto extends PartialType(CreateFinanceContaBancariaDto) {}
