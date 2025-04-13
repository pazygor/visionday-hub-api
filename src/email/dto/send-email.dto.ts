import { IsNotEmpty, IsString } from 'class-validator';
export class SendEmailDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}