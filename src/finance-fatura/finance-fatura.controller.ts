import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceFaturaService } from './finance-fatura.service';
import { CreateFinanceFaturaDto } from './dto/create-finance-fatura.dto';
import { UpdateFinanceFaturaDto } from './dto/update-finance-fatura.dto';

@Controller('finance/faturas')
@UseGuards(JwtAuthGuard)
export class FinanceFaturaController {
  constructor(private readonly service: FinanceFaturaService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateFinanceFaturaDto) {
    return this.service.create(req.user.id, createDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query() filtros: any) {
    return this.service.findAll(req.user.id, filtros);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.service.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateFinanceFaturaDto) {
    return this.service.update(+id, req.user.id, updateDto, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.service.remove(+id, req.user.id);
  }
}
