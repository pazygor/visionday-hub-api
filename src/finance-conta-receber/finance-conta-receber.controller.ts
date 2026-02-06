import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceContaReceberService } from './finance-conta-receber.service';
import { CreateFinanceContaReceberDto } from './dto/create-finance-conta-receber.dto';
import { UpdateFinanceContaReceberDto } from './dto/update-finance-conta-receber.dto';
import { RegistrarPagamentoDto } from './dto/registrar-pagamento.dto';

@Controller('finance/contas-receber')
@UseGuards(JwtAuthGuard)
export class FinanceContaReceberController {
  constructor(private readonly service: FinanceContaReceberService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateFinanceContaReceberDto) {
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
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateFinanceContaReceberDto) {
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
