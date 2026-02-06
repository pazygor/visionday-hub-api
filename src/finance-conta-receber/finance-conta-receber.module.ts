import { Module } from '@nestjs/common';
import { FinanceContaReceberController } from './finance-conta-receber.controller';
import { FinanceContaReceberService } from './finance-conta-receber.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceContaReceberController],
  providers: [FinanceContaReceberService],
  exports: [FinanceContaReceberService],
})
export class FinanceContaReceberModule {}
