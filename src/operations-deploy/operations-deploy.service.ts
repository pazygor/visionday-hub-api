import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOperationsDeployDto } from './dto/create-operations-deploy.dto';
import { UpdateOperationsDeployDto } from './dto/update-operations-deploy.dto';

@Injectable()
export class OperationsDeployService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateOperationsDeployDto) {
    return this.prisma.dP1.create({
      data: {
        empresaId: dto.empresaId,
        oper: dto.oper,
        usergi: dto.usergi,
        userga: dto.userga,
      },
    });
  }

  async findAll() {
    return this.prisma.dP1.findMany({
      include: { empresa: true },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.dP1.findUnique({
      where: { id },
      include: { empresa: true },
    });
    if (!item) throw new NotFoundException('Registro não encontrado');
    return item;
  }

  async update(id: number, dto: UpdateOperationsDeployDto) {
    try {
      return await this.prisma.dP1.update({
        where: { id },
        data: {
          oper: dto.oper,
          usergi: dto.usergi,
          userga: dto.userga,
        },
      });
    } catch {
      throw new NotFoundException('Registro não encontrado');
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.dP1.delete({ where: { id } });
      return { deleted: true };
    } catch {
      throw new NotFoundException('Registro não encontrado');
    }
  }
}
