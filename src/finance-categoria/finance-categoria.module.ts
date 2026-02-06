import { Module } from '@nestjs/common';
import { FinanceCategoriaController } from './finance-categoria.controller';
import { FinanceCategoriaService } from './finance-categoria.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceCategoriaController],
  providers: [FinanceCategoriaService],
  exports: [FinanceCategoriaService],
})
export class FinanceCategoriaModule {}
