import { IsString, IsInt, IsDateString, IsOptional, IsBoolean } from 'class-validator';
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
    @IsOptional()
    localArmazenamento: string;
    
    @IsBoolean()
    @IsOptional()
    monitoramentoProtheus?: boolean
}
