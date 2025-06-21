import {
    IsArray, ValidateNested, IsNumber, IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExternalAlertItemDto {
    @IsNumber() empresa_id: number;
    @IsNumber() criticidadeid: number;
    @IsNumber() metrica_id: number;
    @IsString() nome_campo: string;
    @IsString() tenant: string;
    @IsString() env: string;
    @IsString() ip: string;
    @IsString() type_item: string;
    @IsString() unidade: string;
    @IsNumber() valor: number;
    @IsString() timestamp: string;   // ISO 8601
}

export class ExternalAlertArrayDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExternalAlertItemDto)
    alerts: ExternalAlertItemDto[];
}