import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsInt, 
  IsBoolean, 
  IsDateString, 
  MaxLength,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoReceita } from '../../modules/finance/enums/tipo-receita.enum';

export class CreateFinanceContaReceberDto {
  @IsEnum(TipoReceita, { message: 'Tipo de receita inválido' })
  @IsNotEmpty({ message: 'Tipo de receita é obrigatório' })
  tipo: TipoReceita;

  @ValidateIf((o) => o.tipo === TipoReceita.CLIENTE)
  @IsNotEmpty({ message: 'Cliente é obrigatório para receitas de clientes' })
  @IsInt()
  @Type(() => Number)
  clienteId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoriaId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  contaBancariaId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  formaPagamentoId?: number;

  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(255)
  descricao: string;

  @IsNumber()
  @Min(0.01, { message: 'Valor total deve ser maior que zero' })
  @Type(() => Number)
  valorTotal: number;

  @IsOptional()
  @IsDateString()
  dataEmissao?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de vencimento é obrigatória' })
  dataVencimento: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  numeroParcelas?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  recorrente?: boolean;

  @IsOptional()
  @IsString()
  frequenciaRecorrencia?: string;

  @ValidateIf((o) => o.recorrente === true)
  @IsInt()
  @Min(1, { message: 'Dia deve ser entre 1 e 31' })
  @Max(31, { message: 'Dia deve ser entre 1 e 31' })
  @Type(() => Number)
  diaVencimentoRecorrente?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;
}
