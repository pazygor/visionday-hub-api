/**
 * VISIONDAY ACADEMY - MATRICULA MODULE
 */

import { Module } from '@nestjs/common';
import { AcademyMatriculaService } from './academy-matricula.service';
import { AcademyMatriculaController } from './academy-matricula.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AcademyMatriculaController],
  providers: [AcademyMatriculaService],
  exports: [AcademyMatriculaService],
})
export class AcademyMatriculaModule {}
