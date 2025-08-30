import { IsInt, IsOptional, IsString, IsEmail } from 'class-validator';
export class CreateUsersDeployDto {
    @IsInt()
    empresaId: number;

    @IsString()
    DP0_OPER: string;

    @IsEmail()
    DP0_EMAIL: string;

    @IsString()
    DP0_SENHA: string;
    
    @IsInt()
    permissaoId: number;

    @IsString()
    DP0_GRANTS: string;

    @IsOptional()
    @IsString()
    DP0_USERGI?: string;

    @IsOptional()
    @IsString()
    DP0_USERGA?: string;
}
