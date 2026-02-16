/**
 * VISIONDAY ACADEMY - PROGRESSO MODULE
 */

import { Module } from '@nestjs/common';
import { AcademyProgressoService } from './academy-progresso.service';
import { AcademyProgressoController } from './academy-progresso.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AcademyProgressoController],
  providers: [AcademyProgressoService],
  exports: [AcademyProgressoService],
})
export class AcademyProgressoModule {}
