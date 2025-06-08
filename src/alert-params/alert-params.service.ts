import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAlertParamDto } from './dto/create-alert-param.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAlertParamDto } from './dto/update-alert-param.dto';

@Injectable()
export class AlertParamsService {
  constructor(private prisma: PrismaService) { }
  async findAll() {
    return this.prisma.alertaParametro.findMany();
  }

  async findOne(id: number) {
    return this.prisma.alertaParametro.findUnique({
      where: { id },
    });
  }

  async findByServerId(serverId: number) {
    return this.prisma.alertaParametro.findMany({
      where: {
        serverId: serverId,
      },
    });
  }

  async create(createAlertParamDto: CreateAlertParamDto) {
    return this.prisma.alertaParametro.create({
      data: createAlertParamDto,
    });
  }

  async update(id: number, updateAlertParamDto: UpdateAlertParamDto) {
    return this.prisma.alertaParametro.update({
      where: { id },
      data: updateAlertParamDto,
    });
  }

  async remove(id: number) {
    return this.prisma.alertaParametro.delete({
      where: { id },
    });
  }
  async saveOrUpdateAll(alertParams: CreateAlertParamDto[], serverId: number) {
    if (!serverId) {
      throw new BadRequestException('serverId é obrigatório');
    }

    // Apaga todos os registros existentes com o mesmo serverId
    await this.prisma.alertaParametro.deleteMany({
      where: { serverId },
    });

    // Insere todos os novos registros
    await Promise.all(alertParams.map(data => {
      return this.prisma.alertaParametro.create({
        data: {
          nomeCampo: data.nomeCampo,
          criticidade: { connect: { id: data.criticidadeId } },
          unidadeValor: data.unidadeValor,
          valor: data.valor,
          servidor: { connect: { id: data.serverId } },
          empresa: { connect: { id: data.empresaId } },
          metrica: { connect: { id: data.metricasId } },
          type: data.type,
          tenant: data.tenant,
          env: data.env,
          ip: data.ip
        }
      });
    }));

    // Retorna os registros inseridos
    return this.prisma.alertaParametro.findMany({
      where: { serverId },
    });
  }

}
