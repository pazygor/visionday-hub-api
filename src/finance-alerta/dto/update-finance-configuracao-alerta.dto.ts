import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceConfiguracaoAlertaDto } from './create-finance-configuracao-alerta.dto';

export class UpdateFinanceConfiguracaoAlertaDto extends PartialType(CreateFinanceConfiguracaoAlertaDto) {}
