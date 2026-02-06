import { Module } from '@nestjs/common';
import { FinanceFornecedorController } from './finance-fornecedor.controller';
import { FinanceFornecedorService } from './finance-fornecedor.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceFornecedorController],
  providers: [FinanceFornecedorService],
  exports: [FinanceFornecedorService],
})
export class FinanceFornecedorModule {}
