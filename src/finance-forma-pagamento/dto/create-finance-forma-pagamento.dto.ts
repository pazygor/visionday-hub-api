import { IsString, IsEnum, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateFinanceFormaPagamentoDto {
  @IsString()
  @MaxLength(50)
  nome: string;

  @IsEnum(['A_VISTA', 'PARCELADO', 'RECORRENTE'])
  tipo: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
