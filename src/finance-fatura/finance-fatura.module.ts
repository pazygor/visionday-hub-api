import { Module } from '@nestjs/common';
import { FinanceFaturaController } from './finance-fatura.controller';
import { FinanceFaturaService } from './finance-fatura.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceFaturaController],
  providers: [FinanceFaturaService],
  exports: [FinanceFaturaService],
})
export class FinanceFaturaModule {}
