import { Module } from '@nestjs/common';
import { AcademyCategoriaService } from './academy-categoria.service';
import { AcademyCategoriaController } from './academy-categoria.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AcademyCategoriaController],
  providers: [AcademyCategoriaService, PrismaService],
  exports: [AcademyCategoriaService],
})
export class AcademyCategoriaModule {}
