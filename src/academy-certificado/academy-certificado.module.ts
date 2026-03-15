/**
 * VISIONDAY ACADEMY - CERTIFICADO MODULE
 */

import { Module } from '@nestjs/common';
import { AcademyCertificadoController } from './academy-certificado.controller';
import { AcademyCertificadoService } from './academy-certificado.service';
import { CertificateGeneratorService } from './certificate-generator.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AcademyCertificadoController],
  providers: [AcademyCertificadoService, CertificateGeneratorService],
  exports: [AcademyCertificadoService],
})
export class AcademyCertificadoModule {}
