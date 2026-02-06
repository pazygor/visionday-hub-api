import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFinanceConfiguracaoAlertaDto {
  @IsBoolean()
  contasVencerAtivo: boolean;

  @IsInt()
  @Type(() => Number)
  contasVencerDias: number;

  @IsBoolean()
  contasVencidasAtivo: boolean;

  @IsBoolean()
  limiteContaBancariaAtivo: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limiteContaBancariaValor?: number;

  @IsBoolean()
  emailNotificacao: boolean;

  @IsBoolean()
  notificacaoSistema: boolean;
}
