import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // ajuste se o caminho for diferente
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) { }

  async create(createProjectDto: CreateProjectDto) {
    // Verificar se empresaId foi fornecido e é válido
    if (!createProjectDto.empresaId) {
      throw new Error('O campo empresaId é obrigatório');
    }
    // Buscar tenant da empresa
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: createProjectDto.empresaId },
      select: { tenant: true }
    });

    if (!empresa) {
      throw new Error('Empresa não encontrada');
    }

    // 1. Preparar os dados (sem o env, mas com tenant)
    const data = {
      ...createProjectDto,
      tenant: empresa.tenant,
      dataInicio: new Date(createProjectDto.dataInicio),
      env: '', // temporariamente vazio
    };

    // 2. Criar o projeto
    const projetoCriado = await this.prisma.projeto.create({ data });

    // 3. Gerar o env com base no ID (ex: 000001)
    const env = projetoCriado.id.toString().padStart(6, '0');

    // 4. Atualizar o projeto com o env
    const projetoAtualizado = await this.prisma.projeto.update({
      where: { id: projetoCriado.id },
      data: { env },
    });

    return projetoAtualizado;
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
  async findByEmpresaId(empresaId: number) {
    return this.prisma.projeto.findMany({
      where: { empresaId },
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