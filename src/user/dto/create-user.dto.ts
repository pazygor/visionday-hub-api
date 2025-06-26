import { IsString, IsEmail, IsInt, IsOptional, IsBoolean, IsDateString } from 'class-validator';
export class CreateUserDto {
    @IsInt()
    empresaId: number;

    @IsString()
    nome: string;

    @IsString()
    senha: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    imagem?: string;

    @IsOptional()
    @IsInt()
    permissao?: number;

    @IsOptional()
    @IsString()
    token?: string;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;

    @IsOptional()
    @IsBoolean()
    loginAtivo?: boolean;

    @IsOptional()
    @IsString()
    motivo?: string;

    @IsOptional()
    @IsDateString()
    validade?: Date;

    @IsOptional()
    @IsInt()
    perfil?: number;

    @IsOptional()
    @IsString()
    celular?: string;

    @IsOptional()
    @IsInt()
    cadastro?: number;

    @IsOptional()
    @IsString()
    account?: string;

    @IsOptional()
    @IsString()
    emailLanguage?: string;

    @IsOptional()
    @IsString()
    appLanguage?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsBoolean()
    autoProjectCreation?: boolean;

    @IsOptional()
    @IsString()
    throughPutUnit?: string
    
}
