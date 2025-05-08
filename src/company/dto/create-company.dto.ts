import { IsString, IsNotEmpty, IsDateString, IsInt, Min, MaxLength } from 'class-validator';
export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    cnpj: string;

    @IsString()
    @IsNotEmpty()
    razaoSocial: string;

    @IsString()
    @IsNotEmpty()
    cidade: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(2)
    uf: string;

    @IsString()
    @IsNotEmpty()
    endereco: string;

    @IsString()
    @IsNotEmpty()
    bairro: string;

    @IsString()
    @IsNotEmpty()
    cep: string;

    @IsDateString()
    @IsNotEmpty()
    dataAdesao: string; // '2025-05-03'

    @IsString()
    @IsNotEmpty()
    horaAdesao: string; // '14:30:00' (precisamos converter para Date no service)

    @IsString()
    @IsNotEmpty()
    tenant: string;

    @IsString()
    @IsNotEmpty()
    env: string;


    @IsInt()
    @Min(0)
    limiteProjetos: number;

    @IsInt()
    @Min(0)
    limiteServidores: number;
}
