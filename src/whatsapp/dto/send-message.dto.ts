import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
    @IsNotEmpty()
    @IsString()
    number: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}