import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceCategoriaDto } from './create-finance-categoria.dto';

export class UpdateFinanceCategoriaDto extends PartialType(CreateFinanceCategoriaDto) {}
