import { Module } from '@nestjs/common';
import { FinanceFormaPagamentoController } from './finance-forma-pagamento.controller';
import { FinanceFormaPagamentoService } from './finance-forma-pagamento.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceFormaPagamentoController],
  providers: [FinanceFormaPagamentoService],
  exports: [FinanceFormaPagamentoService],
})
export class FinanceFormaPagamentoModule {}
