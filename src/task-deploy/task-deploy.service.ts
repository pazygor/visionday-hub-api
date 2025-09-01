// task-deploy.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDeployDto } from './dto/create-task-deploy.dto';
import { UpdateTaskDeployDto } from './dto/update-task-deploy.dto';

@Injectable()
export class TaskDeployService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateTaskDeployDto) {
    // Busca o último codtsk dessa empresa
    const lastTask = await this.prisma.dP2.findFirst({
      where: { empresaId: dto.empresaId },
      orderBy: { codtsk: 'desc' },
    });

    const nextCodtsk = lastTask ? lastTask.codtsk + 10 : 10;

    return this.prisma.dP2.create({
      data: {
        codtsk: nextCodtsk,
        empresaId: dto.empresaId,
        task: dto.task,
        tag: dto.tag,
        usergi: dto.usergi ?? 'system',
        userga: dto.userga ?? 'system',
      },
    });
  }

  async findAll() {
    return this.prisma.dP2.findMany();
  }

  // async findOne(id: number) {
  //   return this.prisma.dP2.findUnique({
  //     where: { codtsk: id },
  //   });
  // }
  async findByEmpresa(empresaId: number) {
    return this.prisma.dP2.findMany({
      where: { empresaId },
      orderBy: { codtsk: 'asc' }, // ordena pelo codtsk crescente
    });
  }

  // task-deploy.service.ts
  async update(empresaId: number, codtsk: number, dto: UpdateTaskDeployDto) {
    return this.prisma.dP2.update({
      where: {
        empresaId_codtsk: {  // Nome que o Prisma gera automaticamente
          empresaId,
          codtsk,
        },
      },
      data: {
        task: dto.task,
        tag: dto.tag,
        userga: dto.userga ?? 'system',
      },
    });
  }


  // async remove(id: number) {
  //   return this.prisma.dP2.delete({
  //     where: { codtsk: id },
  //   });
  // }
  async deleteTask(empresaId: number, codtsk: number): Promise<void> {
    await this.prisma.dP2.delete({
      where: {
        empresaId_codtsk: {
          empresaId,
          codtsk,
        },
      },
    });
  }

}
