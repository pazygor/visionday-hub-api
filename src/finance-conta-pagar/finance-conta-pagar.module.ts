import { Module } from '@nestjs/common';
import { FinanceContaPagarController } from './finance-conta-pagar.controller';
import { FinanceContaPagarService } from './finance-conta-pagar.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceContaPagarController],
  providers: [FinanceContaPagarService],
  exports: [FinanceContaPagarService],
})
export class FinanceContaPagarModule {}
