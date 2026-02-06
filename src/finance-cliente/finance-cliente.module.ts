import { Module } from '@nestjs/common';
import { FinanceClienteController } from './finance-cliente.controller';
import { FinanceClienteService } from './finance-cliente.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceClienteController],
  providers: [FinanceClienteService],
  exports: [FinanceClienteService],
})
export class FinanceClienteModule {}
