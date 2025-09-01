import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServersDeployDto } from './dto/create-servers-deploy.dto';
import { UpdateServersDeployDto } from './dto/update-servers-deploy.dto';

@Injectable()
export class ServersDeployService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateServersDeployDto) {
    return this.prisma.dP3.create({
      data: {
        empresaId: dto.empresaId,
        nome: dto.nome,
        ipsvs: dto.ipsvs,
        porta: dto.porta,
        usergi: dto.usergi ?? 'system',
      },
    });
  }

  async findAll(empresaId: number) {
    return this.prisma.dP3.findMany({
      where: { empresaId },
    });
  }

  async findOne(id: number) {
    return this.prisma.dP3.findUnique({
      where: { codent: id },
    });
  }
  async findByEmpresa(empresaId: number) {
    return this.prisma.dP3.findMany({
      where: { empresaId },
    });
  }
  async update(id: number, dto: UpdateServersDeployDto) {
    return this.prisma.dP3.update({
      where: { codent: id },
      data: {
        nome: dto.nome,
        ipsvs: dto.ipsvs,
        porta: dto.porta,
        userga: dto.userga ?? 'system',
      },
    });
  }

  async remove(id: number) {
    return this.prisma.dP3.delete({
      where: { codent: id },
    });
  }
}
