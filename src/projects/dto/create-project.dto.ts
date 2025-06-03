import { IsString, IsInt, IsDateString, IsOptional } from 'class-validator';
export class CreateProjectDto {
    @IsString()
    nome: string;

    @IsString()
    @IsOptional()
    env: string;

    @IsString()
    @IsOptional()
    tenant: string;

    @IsDateString()
    dataInicio: string;

    @IsString()
    status: string;

    @IsInt()
    empresaId: number; // Garantir que seja obrigatório

    @IsString()
    localArmazenamento: string;
}
