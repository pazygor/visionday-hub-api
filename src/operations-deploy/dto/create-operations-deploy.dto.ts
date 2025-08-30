import { IsInt, IsOptional, IsString } from 'class-validator';
export class CreateOperationsDeployDto {
    @IsInt()
    empresaId: number;

    @IsString()
    oper: string;

    @IsOptional()
    @IsString()
    usergi?: string;

    @IsOptional()
    @IsString()
    userga?: string;
}
