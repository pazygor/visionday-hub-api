import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceCategoriaService } from './finance-categoria.service';
import { CreateFinanceCategoriaDto } from './dto/create-finance-categoria.dto';
import { UpdateFinanceCategoriaDto } from './dto/update-finance-categoria.dto';

@Controller('finance/categorias')
@UseGuards(JwtAuthGuard)
export class FinanceCategoriaController {
  constructor(private readonly service: FinanceCategoriaService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateFinanceCategoriaDto) {
    return this.service.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Request() req, @Query('tipo') tipo?: 'RECEITA' | 'DESPESA') {
    if (tipo) {
      return this.service.findByTipo(req.user.id, tipo);
    }
    return this.service.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.service.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateFinanceCategoriaDto) {
    return this.service.update(+id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.service.remove(+id, req.user.id);
  }
}
