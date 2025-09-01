import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateServersDeployDto {
    @IsInt()
    empresaId: number;

    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    ipsvs?: string;

    @IsOptional()
    @IsString()
    porta?: string;

    @IsOptional()
    @IsString()
    usergi?: string;

    @IsOptional()
    @IsString()
    userga?: string;
}
