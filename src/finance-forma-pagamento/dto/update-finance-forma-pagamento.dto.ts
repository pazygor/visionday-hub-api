import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceFormaPagamentoDto } from './create-finance-forma-pagamento.dto';

export class UpdateFinanceFormaPagamentoDto extends PartialType(CreateFinanceFormaPagamentoDto) {}
