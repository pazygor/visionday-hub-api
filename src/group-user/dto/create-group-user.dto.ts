import { IsInt } from 'class-validator';
export class CreateGroupUserDto {
    @IsInt()
    usuarioId: number;

    @IsInt()
    grupoId: number;
}
