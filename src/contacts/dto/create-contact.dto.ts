import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsNotEmpty()
    readonly server_id: number;

    @IsNotEmpty()
    readonly alert_id: number;
}