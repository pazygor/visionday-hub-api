import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupUserDto } from './dto/create-group-user.dto';
import { UpdateGroupUserDto } from './dto/update-group-user.dto';

@Injectable()
export class GroupUserService {
  constructor(private prisma: PrismaService) { }
  create(createGrupoUsuarioDto: CreateGroupUserDto) {
    return this.prisma.grupoUsuario.create({
      data: {
        usuarioId: createGrupoUsuarioDto.usuarioId,
        grupoId: createGrupoUsuarioDto.grupoId,
      },
    });
  }

  findAll() {
    return this.prisma.grupoUsuario.findMany({
      include: {
        usuario: true,
        grupo: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.grupoUsuario.findUnique({
      where: { id },
      include: {
        usuario: true,
        grupo: true,
      },
    });
  }

  update(id: number, updateGrupoUsuarioDto: UpdateGroupUserDto) {
    return this.prisma.grupoUsuario.update({
      where: { id },
      data: updateGrupoUsuarioDto,
    });
  }

  remove(id: number) {
    return this.prisma.grupoUsuario.delete({
      where: { id },
    });
  }
}
