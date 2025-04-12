import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateContactDto {
    @IsString()
    @IsOptional()
    readonly name?: string;

    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @IsString()
    @IsOptional()
    readonly phone?: string;
}