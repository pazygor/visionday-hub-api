import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FinanceCategoriaModule } from './finance-categoria/finance-categoria.module';
import { FinanceFormaPagamentoModule } from './finance-forma-pagamento/finance-forma-pagamento.module';
import { FinanceContaBancariaModule } from './finance-conta-bancaria/finance-conta-bancaria.module';
import { FinanceClienteModule } from './finance-cliente/finance-cliente.module';
import { FinanceFornecedorModule } from './finance-fornecedor/finance-fornecedor.module';
import { FinanceContaReceberModule } from './finance-conta-receber/finance-conta-receber.module';
import { FinanceContaPagarModule } from './finance-conta-pagar/finance-conta-pagar.module';
import { FinanceFaturaModule } from './finance-fatura/finance-fatura.module';
import { FinanceAlertaModule } from './finance-alerta/finance-alerta.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    FinanceCategoriaModule,
    FinanceFormaPagamentoModule,
    FinanceContaBancariaModule,
    FinanceClienteModule,
    FinanceFornecedorModule,
    FinanceContaReceberModule,
    FinanceContaPagarModule,
    FinanceFaturaModule,
    FinanceAlertaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
