// src/servers/servers.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // ajuste se o caminho for diferente
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) { }

  create(createServerDto: CreateServerDto) {
    return this.prisma.servidor.create({
      data: {
        ...createServerDto,
      },
    });
  }

  findAll() {
    return this.prisma.servidor.findMany();
  }

  findOne(id: number) {
    return this.prisma.servidor.findUnique({
      where: { id },
    });
  }

  update(id: number, updateServerDto: UpdateServerDto) {
    return this.prisma.servidor.update({
      where: { id },
      data: updateServerDto,
    });
  }

  remove(id: number) {
    return this.prisma.servidor.delete({
      where: { id },
    });
  }
  async getAlertDataByServer(serverId: number) {
    // Busca o servidor com as relações para empresa e projeto
    const server = await this.prisma.servidor.findUnique({
      where: { id: serverId },
      include: {
        empresa: {
          select: { tenant: true },
        },
        projeto: {
          select: { env: true },
        },
      },
    });

    if (!server) {
      return {
        success: false,
        message: 'Servidor não encontrado.',
      };
    }
    
    const tenant = server.empresa?.tenant;
    const env = server.projeto?.env;
    const ip = server.ip;

    // Busca os contatos de alerta
    const contacts = await this.prisma.alertaUsuario.findMany({
      where: { servidorId: serverId },
    });

    // Busca os parâmetros de alerta
    const infraParameters = await this.prisma.alertaParametro.findMany({
      where: { serverId: serverId },
    });

    return {
      success: true,
      data: {
        tenant,         // Vem da empresa
        env,            // Vem do projeto
        ip,         
        contacts,
        infraParameters,
      },
    };
  }
}
