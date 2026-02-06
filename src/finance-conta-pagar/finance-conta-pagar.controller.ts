import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceContaPagarService } from './finance-conta-pagar.service';
import { CreateFinanceContaPagarDto } from './dto/create-finance-conta-pagar.dto';
import { UpdateFinanceContaPagarDto } from './dto/update-finance-conta-pagar.dto';
import { RegistrarPagamentoDto } from './dto/registrar-pagamento.dto';

@Controller('finance/contas-pagar')
@UseGuards(JwtAuthGuard)
export class FinanceContaPagarController {
  constructor(private readonly service: FinanceContaPagarService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateFinanceContaPagarDto) {
    return this.service.create(req.user.id, createDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query() filtros: any) {
    return this.service.findAll(req.user.id, filtros);
  }

  @Get('resumo')
  getResumo(@Request() req) {
    return this.service.getResumo(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.service.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateFinanceContaPagarDto) {
    return this.service.update(+id, req.user.id, updateDto, req.user.id);
  }

  @Post(':id/pagamento')
  registrarPagamento(@Request() req, @Param('id') id: string, @Body() dto: RegistrarPagamentoDto) {
    return this.service.registrarPagamento(+id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.service.remove(+id, req.user.id);
  }
}
