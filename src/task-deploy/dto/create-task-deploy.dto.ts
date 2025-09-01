import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTaskDeployDto {
    @IsInt()
    empresaId: number;

    @IsString()
    task: string;

    @IsOptional()
    @IsString()
    tag?: string;

    @IsOptional()
    @IsString()
    usergi?: string; // Log inclusão
    @IsOptional()
    @IsString()
    userga?: string;
}
