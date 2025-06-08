import { IsString, IsNotEmpty, IsInt, IsNumber } from 'class-validator';
export class CreateAlertParamDto {
    @IsInt()
    @IsNotEmpty()
    serverId: number;

    @IsInt()
    @IsNotEmpty()
    empresaId: number;

    @IsInt()
    @IsNotEmpty()
    metricasId: number;

    @IsInt()
    @IsNotEmpty()
    criticidadeId: number;

    @IsString()
    @IsNotEmpty()
    nomeCampo: string;

    @IsNumber()
    @IsNotEmpty()
    valor: number;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    unidadeValor: string;
    // ✅ Campos adicionados recentemente:
    @IsString()
    @IsNotEmpty()
    tenant: string;

    @IsString()
    @IsNotEmpty()
    env: string;

    @IsString()
    @IsNotEmpty()
    ip: string;
}

