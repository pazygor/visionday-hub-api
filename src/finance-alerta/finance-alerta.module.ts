import { Module } from '@nestjs/common';
import { FinanceAlertaController } from './finance-alerta.controller';
import { FinanceAlertaService } from './finance-alerta.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceAlertaController],
  providers: [FinanceAlertaService],
  exports: [FinanceAlertaService],
})
export class FinanceAlertaModule {}
