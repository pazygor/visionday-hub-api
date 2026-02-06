import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceFormaPagamentoService } from './finance-forma-pagamento.service';
import { CreateFinanceFormaPagamentoDto } from './dto/create-finance-forma-pagamento.dto';
import { UpdateFinanceFormaPagamentoDto } from './dto/update-finance-forma-pagamento.dto';

@Controller('finance/formas-pagamento')
@UseGuards(JwtAuthGuard)
export class FinanceFormaPagamentoController {
  constructor(private readonly service: FinanceFormaPagamentoService) {}

  @Post()
  create(@Body() createDto: CreateFinanceFormaPagamentoDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateFinanceFormaPagamentoDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
