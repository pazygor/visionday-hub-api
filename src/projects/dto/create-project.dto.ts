import { IsString, IsInt, IsDateString, IsOptional } from 'class-validator';
export class CreateProjectDto {
    @IsString()
    nome: string;

    @IsString()
    env: string;

    @IsString()
    tenant: string;

    @IsDateString()
    dataInicio: string;

    @IsString()
    usuarioProprietario: string;

    @IsString()
    status: string;

    @IsOptional()
    @IsInt()
    empresaId?: number;
}
