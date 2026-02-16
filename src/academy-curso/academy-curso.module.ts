import { Module } from '@nestjs/common';
import { AcademyCursoService } from './academy-curso.service';
import { AcademyCursoController } from './academy-curso.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AcademyCursoController],
  providers: [AcademyCursoService, PrismaService],
  exports: [AcademyCursoService],
})
export class AcademyCursoModule {}
