import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // ajuste se o caminho for diferente
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) { }

  create(createProjectDto: CreateProjectDto) {
    return this.prisma.projeto.create({
      data: {
        ...createProjectDto,
        dataInicio: new Date(createProjectDto.dataInicio),
      },
    });
  }

  findAll() {
    return this.prisma.projeto.findMany();
  }

  findOne(id: number) {
    return this.prisma.projeto.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.projeto.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  remove(id: number) {
    return this.prisma.projeto.delete({
      where: { id },
    });
  }
}

// @Injectable()
// export class ProjectsService {
//   constructor(private readonly prisma: PrismaService) { }

//   async create(createProjectDto: CreateProjectDto) {
//     const { nome, env, tenant, userProp, status, inicio, empresaId } = createProjectDto;

//     const existingProject = await this.prisma.project.findFirst({
//       where: { tenant, env },
//     });

//     if (existingProject) {
//       return this.prisma.project.update({
//         where: { id: existingProject.id },
//         data: {
//           nome,
//           userProp,
//           status,
//           inicio,
//           empresaId: empresaId ?? null,
//         },
//       });
//     } else {
//       return this.prisma.project.create({
//         data: {
//           nome,
//           env,
//           tenant,
//           userProp,
//           status,
//           inicio,
//           empresaId: empresaId ?? null,
//         },
//       });
//     }
//   }


//   async findAll() {
//     return this.prisma.project.findMany({
//       include: {
//         servers: true,
//         empresa: true,
//       },
//     });
//   }

//   async findOne(id: number) {
//     return this.prisma.project.findUnique({
//       where: { id },
//       include: {
//         servers: true,
//         empresa: true,
//       },
//     });
//   }

//   async update(id: number, updateProjectDto: UpdateProjectDto) {
//     return this.prisma.project.update({
//       where: { id },
//       data: updateProjectDto,
//     });
//   }

//   async remove(id: number) {
//     return this.prisma.project.delete({
//       where: { id },
//     });
//   }
// }