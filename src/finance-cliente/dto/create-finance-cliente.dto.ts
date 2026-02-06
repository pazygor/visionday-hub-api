import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class CreateFinanceClienteDto {
  @IsString()
  @MaxLength(255)
  nome: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  cpfCnpj?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
