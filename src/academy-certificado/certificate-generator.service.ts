/**
 * VISIONDAY ACADEMY - CERTIFICATE GENERATOR SERVICE
 * Serviço para geração de certificados em PDF
 */

import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

export interface CertificateData {
  codigo: string;
  usuarioNome: string;
  cursoTitulo: string;
  cargaHoraria: number;
  dataEmissao: Date;
  hashValidacao: string;
}

@Injectable()
export class CertificateGeneratorService {
  private readonly uploadsDir: string;

  constructor() {
    // Diretório para salvar os PDFs
    this.uploadsDir = path.join(process.cwd(), 'uploads', 'certificados');
    
    // Criar diretório se não existir
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Gerar certificado em PDF
   */
  async generatePDF(data: CertificateData): Promise<string> {
    const filename = `${data.codigo}.pdf`;
    const filepath = path.join(this.uploadsDir, filename);

    // Se o arquivo já existe, retornar o caminho
    if (fs.existsSync(filepath)) {
      return `/uploads/certificados/${filename}`;
    }

    return new Promise((resolve, reject) => {
      try {
        // Criar documento PDF
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        // Stream para arquivo
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Desenhar certificado
        this.drawCertificate(doc, data);

        // Finalizar documento
        doc.end();

        // Quando o stream terminar
        stream.on('finish', () => {
          resolve(`/uploads/certificados/${filename}`);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Desenhar o template do certificado
   */
  private drawCertificate(doc: typeof PDFDocument, data: CertificateData): void {
    const pageWidth = 841.89; // A4 landscape width
    const pageHeight = 595.28; // A4 landscape height

    // BORDA DECORATIVA
    doc
      .lineWidth(3)
      .strokeColor('#2563eb')
      .rect(20, 20, pageWidth - 40, pageHeight - 40)
      .stroke();

    doc
      .lineWidth(1)
      .strokeColor('#60a5fa')
      .rect(30, 30, pageWidth - 60, pageHeight - 60)
      .stroke();

    // LOGO/CABEÇALHO
    doc
      .fontSize(28)
      .font('Helvetica-Bold')
      .fillColor('#1e40af')
      .text('VISIONDAY ACADEMY', 0, 70, { align: 'center' });

    // TÍTULO "CERTIFICADO"
    doc
      .fontSize(48)
      .font('Helvetica-Bold')
      .fillColor('#2563eb')
      .text('CERTIFICADO', 0, 130, { align: 'center' });

    doc
      .fontSize(14)
      .font('Helvetica')
      .fillColor('#64748b')
      .text('DE CONCLUSÃO DE CURSO', 0, 190, { align: 'center' });

    // TEXTO PRINCIPAL
    doc
      .fontSize(16)
      .font('Helvetica')
      .fillColor('#334155')
      .text('Certificamos que', 0, 240, { align: 'center' });

    // NOME DO ALUNO (destaque)
    doc
      .fontSize(32)
      .font('Helvetica-Bold')
      .fillColor('#1e293b')
      .text(data.usuarioNome.toUpperCase(), 0, 275, { align: 'center' });

    // TEXTO COMPLEMENTAR
    doc
      .fontSize(16)
      .font('Helvetica')
      .fillColor('#334155')
      .text('concluiu com êxito o curso', 0, 330, { align: 'center' });

    // NOME DO CURSO (destaque)
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#2563eb')
      .text(`"${data.cursoTitulo}"`, 50, 365, { 
        align: 'center',
        width: pageWidth - 100,
      });

    // CARGA HORÁRIA
    const cargaHorariaText = `com carga horária de ${data.cargaHoraria} horas`;
    doc
      .fontSize(14)
      .font('Helvetica')
      .fillColor('#475569')
      .text(cargaHorariaText, 0, 420, { align: 'center' });

    // DATA DE EMISSÃO
    const dataFormatada = this.formatDate(data.dataEmissao);
    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#64748b')
      .text(`Emitido em ${dataFormatada}`, 0, 460, { align: 'center' });

    // RODAPÉ - CÓDIGO E VALIDAÇÃO
    const rodapeY = pageHeight - 80;

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#475569')
      .text('Código do Certificado:', 60, rodapeY);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#64748b')
      .text(data.codigo, 60, rodapeY + 15);

    // QR CODE (simulado com texto)
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#64748b')
      .text('Validação:', pageWidth - 200, rodapeY);

    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#94a3b8')
      .text(`Hash: ${data.hashValidacao.substring(0, 32)}...`, pageWidth - 200, rodapeY + 15, {
        width: 140,
      });

    // ASSINATURA (linha decorativa)
    const assinaturaY = rodapeY - 40;
    const assinaturaX = pageWidth / 2 - 100;

    doc
      .lineWidth(1)
      .strokeColor('#cbd5e1')
      .moveTo(assinaturaX, assinaturaY)
      .lineTo(assinaturaX + 200, assinaturaY)
      .stroke();

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#475569')
      .text('VisionDay Academy', assinaturaX, assinaturaY + 10, {
        width: 200,
        align: 'center',
      });

    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#94a3b8')
      .text('Plataforma de Ensino Online', assinaturaX, assinaturaY + 25, {
        width: 200,
        align: 'center',
      });
  }

  /**
   * Formatar data para o certificado
   */
  private formatDate(date: Date): string {
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const ano = date.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
  }

  /**
   * Deletar arquivo de certificado
   */
  async deletePDF(codigo: string): Promise<void> {
    const filename = `${codigo}.pdf`;
    const filepath = path.join(this.uploadsDir, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}
