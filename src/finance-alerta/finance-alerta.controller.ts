import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceAlertaService } from './finance-alerta.service';
import { CreateFinanceConfiguracaoAlertaDto } from './dto/create-finance-configuracao-alerta.dto';
import { UpdateFinanceConfiguracaoAlertaDto } from './dto/update-finance-configuracao-alerta.dto';

@Controller('finance/alertas')
@UseGuards(JwtAuthGuard)
export class FinanceAlertaController {
  constructor(private readonly service: FinanceAlertaService) {}

  // Configuração
  @Post('configuracao')
  createConfiguracaoAlerta(@Request() req, @Body() createDto: CreateFinanceConfiguracaoAlertaDto) {
    return this.service.createConfiguracaoAlerta(req.user.id, createDto, req.user.id);
  }

  @Get('configuracao')
  getConfiguracaoAlerta(@Request() req) {
    return this.service.getConfiguracaoAlerta(req.user.id);
  }

  @Patch('configuracao')
  updateConfiguracaoAlerta(@Request() req, @Body() updateDto: UpdateFinanceConfiguracaoAlertaDto) {
    return this.service.updateConfiguracaoAlerta(req.user.id, updateDto, req.user.id);
  }

  // Alertas
  @Get()
  findAllAlertas(@Request() req, @Query('apenasNaoLidos') apenasNaoLidos?: boolean) {
    return this.service.findAllAlertas(req.user.id, apenasNaoLidos);
  }

  @Get('contador-nao-lidos')
  getContadorNaoLidos(@Request() req) {
    return this.service.getContadorNaoLidos(req.user.id);
  }

  @Get(':id')
  findOneAlerta(@Request() req, @Param('id') id: string) {
    return this.service.findOneAlerta(+id, req.user.id);
  }

  @Patch(':id/marcar-lido')
  marcarComoLido(@Request() req, @Param('id') id: string) {
    return this.service.marcarComoLido(+id, req.user.id);
  }

  @Patch('marcar-todos-lidos')
  marcarTodosComoLidos(@Request() req) {
    return this.service.marcarTodosComoLidos(req.user.id);
  }

  @Delete(':id')
  removeAlerta(@Request() req, @Param('id') id: string) {
    return this.service.removeAlerta(+id, req.user.id);
  }

  @Post('gerar')
  gerarAlertas(@Request() req) {
    return this.service.gerarAlertas(req.user.id);
  }
}
