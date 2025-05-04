import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    descricao?: string;
}
