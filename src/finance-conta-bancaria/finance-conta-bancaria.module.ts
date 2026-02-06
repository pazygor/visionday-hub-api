import { Module } from '@nestjs/common';
import { FinanceContaBancariaController } from './finance-conta-bancaria.controller';
import { FinanceContaBancariaService } from './finance-conta-bancaria.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceContaBancariaController],
  providers: [FinanceContaBancariaService],
  exports: [FinanceContaBancariaService],
})
export class FinanceContaBancariaModule {}
