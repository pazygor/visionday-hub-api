import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // ajuste o path conforme seu projeto
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateCompanyDto) {
    // 1. Preparar dados (sem o tenant)
    const data = {
      ...dto,
      dataAdesao: new Date(dto.dataAdesao),
      horaAdesao: new Date(`1970-01-01T${dto.horaAdesao}`),
      tenant: '', // temporariamente vazio
    };

    // 2. Criar empresa no banco
    const empresaCriada = await this.prisma.empresa.create({ data });

    // 3. Gerar tenant baseado no ID (ex: 000001)
    const tenant = empresaCriada.id.toString().padStart(6, '0');

    // 4. Atualizar empresa com tenant
    const empresaAtualizada = await this.prisma.empresa.update({
      where: { id: empresaCriada.id },
      data: { tenant },
    });

    return empresaAtualizada;
  }

  async findAll() {
    const companies = await this.prisma.empresa.findMany();
    return companies.map((company) => ({
      ...company,
      horaAdesao: company.horaAdesao
        ? company.horaAdesao.toTimeString().split(' ')[0] // pega só "HH:MM:SS"
        : null,
    }));
  }

  async findOne(id: number) {
    const company = await this.prisma.empresa.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      ...company,
      horaAdesao: company.horaAdesao
        ? company.horaAdesao.toTimeString().split(' ')[0]
        : null,
    };
  }

  async update(id: number, dto: UpdateCompanyDto) {
    const company = await this.prisma.empresa.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    let data: any = { ...dto };

    if (dto.dataAdesao) {
      data.dataAdesao = new Date(dto.dataAdesao);
    }
    if (dto.horaAdesao) {
      data.horaAdesao = new Date(`1970-01-01T${dto.horaAdesao}`);
    }

    return this.prisma.empresa.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const company = await this.prisma.empresa.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return this.prisma.empresa.delete({ where: { id } });
  }

  async getProdutosDisponiveis(empresaId: number) {
    return this.prisma.empresaProduto.findMany({
      where: {
        empresa_id: empresaId,
        status: 'ativo', // filtra apenas os produtos ativos para essa empresa
      },
      include: {
        produto: true, // traz os dados do produto associado
      },
    });
  }
  async getLimitesDaEmpresa(empresaId: number) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: {
        limiteProjetos: true,
        limiteServidores: true
      }
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com id ${empresaId} não encontrada.`);
    }

    return {
      limiteProjetos: empresa.limiteProjetos,
      limiteServidores: empresa.limiteServidores
    };
  }
  async getProdutosEmpresaDisponiveisPorUsuarioId(usuarioId: number) {
    const empresa = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { empresa: true },
    });

    if (!empresa) {
      throw new NotFoundException(`Usuário com id ${usuarioId} não encontrado.`);
    }

    const empresa_id = empresa.empresa.id;
    return this.prisma.empresaProduto.findMany({
      where: {
        empresa_id,
        status: 'ativo', // filtra apenas os produtos ativos para essa empresa
      },
      include: {
        produto: true, // traz os dados do produto associado
      },
    });
  }
}
