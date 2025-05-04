import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) { }

  create(createGrupoDto: CreateGroupDto) {
    return this.prisma.grupo.create({
      data: {
        nome: createGrupoDto.nome,
        descricao: createGrupoDto.descricao,
      },
    });
  }

  findAll() {
    return this.prisma.grupo.findMany({
      include: {
        usuarios: true,
        alertas: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.grupo.findUnique({
      where: { id },
      include: {
        usuarios: true,
        alertas: true,
      },
    });
  }

  update(id: number, updateGrupoDto: UpdateGroupDto) {
    return this.prisma.grupo.update({
      where: { id },
      data: updateGrupoDto,
    });
  }

  remove(id: number) {
    return this.prisma.grupo.delete({
      where: { id },
    });
  }
}
