/**
 * VISIONDAY ACADEMY - CERTIFICADO SERVICE
 * Serviço para gerenciamento de certificados
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CertificateGeneratorService } from './certificate-generator.service';
import { GenerateCertificadoDto, ValidateCertificadoDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class AcademyCertificadoService {
  constructor(
    private prisma: PrismaService,
    private certificateGenerator: CertificateGeneratorService,
  ) {}

  /**
   * Gerar certificado para uma matrícula concluída
   */
  async generate(usuarioId: number, generateDto: GenerateCertificadoDto) {
    const { matriculaId } = generateDto;

    // Verificar se a matrícula pertence ao usuário e está concluída
    const matricula = await this.prisma.academyMatricula.findFirst({
      where: {
        id: matriculaId,
        usuarioId,
      },
      include: {
        curso: {
          include: {
            categoria: true,
          },
        },
        usuario: true,
        certificado: true,
      },
    });

    if (!matricula) {
      throw new NotFoundException('Matrícula não encontrada');
    }

    if (matricula.status !== 'CONCLUIDA' && matricula.progressoGeral < 100) {
      throw new BadRequestException('O curso ainda não foi concluído');
    }

    // Verificar se já existe certificado
    if (matricula.certificado) {
      return matricula.certificado;
    }

    // Gerar código único
    const ano = new Date().getFullYear();
    const count = await this.prisma.academyCertificado.count() + 1;
    const codigo = `CERT-${ano}-${String(count).padStart(6, '0')}`;

    // Gerar hash de validação
    const hashValidacao = this.generateHash(codigo, usuarioId, matricula.cursoId);

    // Criar certificado
    const certificado = await this.prisma.academyCertificado.create({
      data: {
        matriculaId,
        codigo,
        usuarioId,
        cursoId: matricula.cursoId,
        validadeInicio: new Date(),
        cargaHoraria: matricula.curso.cargaHoraria || 0,
        hashValidacao,
      },
      include: {
        curso: true,
        usuario: true,
      },
    });

    return certificado;
  }

  /**
   * Listar certificados do usuário
   */
  async findByUser(usuarioId: number) {
    return this.prisma.academyCertificado.findMany({
      where: {
        usuarioId,
        ativo: true,
      },
      include: {
        curso: {
          include: {
            categoria: true,
          },
        },
        matricula: true,
      },
      orderBy: {
        dataEmissao: 'desc',
      },
    });
  }

  /**
   * Buscar certificado por código
   */
  async findByCodigo(codigo: string) {
    const certificado = await this.prisma.academyCertificado.findUnique({
      where: { codigo },
      include: {
        curso: true,
        usuario: true,
        matricula: true,
      },
    });

    if (!certificado) {
      throw new NotFoundException('Certificado não encontrado');
    }

    return certificado;
  }

  /**
   * Validar certificado por hash (público)
   */
  async validate(hash: string): Promise<ValidateCertificadoDto> {
    const certificado = await this.prisma.academyCertificado.findUnique({
      where: { hashValidacao: hash },
      include: {
        curso: true,
        usuario: true,
      },
    });

    if (!certificado || !certificado.ativo) {
      return {
        codigo: '',
        valido: false,
      };
    }

    return {
      codigo: certificado.codigo,
      valido: true,
      dataEmissao: certificado.dataEmissao,
      usuarioNome: certificado.usuario.nome,
      cursoTitulo: certificado.curso.titulo,
      cargaHoraria: certificado.cargaHoraria,
    };
  }

  /**
   * Download do certificado (retorna URL do PDF)
   */
  async download(usuarioId: number, codigo: string) {
    const certificado = await this.prisma.academyCertificado.findFirst({
      where: {
        codigo,
        usuarioId,
      },
      include: {
        curso: true,
        usuario: true,
      },
    });

    if (!certificado) {
      throw new NotFoundException('Certificado não encontrado');
    }

    // Gerar PDF se não existir
    if (!certificado.arquivoUrl) {
      try {
        const pdfUrl = await this.certificateGenerator.generatePDF({
          codigo: certificado.codigo,
          usuarioNome: certificado.usuario.nome,
          cursoTitulo: certificado.curso.titulo,
          cargaHoraria: certificado.cargaHoraria,
          dataEmissao: certificado.dataEmissao,
          hashValidacao: certificado.hashValidacao,
        });

        // Atualizar certificado com URL do PDF
        await this.prisma.academyCertificado.update({
          where: { id: certificado.id },
          data: { arquivoUrl: pdfUrl },
        });

        return {
          codigo: certificado.codigo,
          arquivoUrl: pdfUrl,
        };
      } catch (error) {
        throw new BadRequestException('Erro ao gerar PDF do certificado');
      }
    }

    return {
      codigo: certificado.codigo,
      arquivoUrl: certificado.arquivoUrl,
    };
  }

  /**
   * Gerar hash de validação
   */
  private generateHash(codigo: string, usuarioId: number, cursoId: number): string {
    const data = `${codigo}-${usuarioId}-${cursoId}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Emissão automática ao concluir curso
   */
  async autoGenerate(matriculaId: number) {
    const matricula = await this.prisma.academyMatricula.findUnique({
      where: { id: matriculaId },
      include: {
        certificado: true,
      },
    });

    if (!matricula) {
      return null;
    }

    // Só gera se não tiver certificado e estiver concluído
    if (matricula.certificado || matricula.status !== 'CONCLUIDA') {
      return null;
    }

    return this.generate(matricula.usuarioId, { matriculaId });
  }
}
