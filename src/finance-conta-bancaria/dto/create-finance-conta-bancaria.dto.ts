import { IsString, IsEnum, IsBoolean, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFinanceContaBancariaDto {
  @IsString()
  @MaxLength(100)
  banco: string;

  @IsString()
  @MaxLength(20)
  agencia: string;

  @IsString()
  @MaxLength(30)
  conta: string;

  @IsEnum(['CORRENTE', 'POUPANCA', 'INVESTIMENTO'])
  tipoConta: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  saldoInicial?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  chavePix?: string;

  @IsOptional()
  @IsBoolean()
  principal?: boolean;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
