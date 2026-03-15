/**
 * VISIONDAY ACADEMY - PROGRESSO MODULE
 */

import { Module, forwardRef } from '@nestjs/common';
import { AcademyProgressoService } from './academy-progresso.service';
import { AcademyProgressoController } from './academy-progresso.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AcademyCertificadoModule } from '../academy-certificado/academy-certificado.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AcademyCertificadoModule)],
  controllers: [AcademyProgressoController],
  providers: [AcademyProgressoService],
  exports: [AcademyProgressoService],
})
export class AcademyProgressoModule {}
