import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProjectIdentifierDto {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsOptional()
    @IsString()
    env?: string;
}

export class EnableProjectsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProjectIdentifierDto)
    projetos: ProjectIdentifierDto[];
}
