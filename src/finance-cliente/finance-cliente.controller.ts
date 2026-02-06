import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceClienteService } from './finance-cliente.service';
import { CreateFinanceClienteDto } from './dto/create-finance-cliente.dto';
import { UpdateFinanceClienteDto } from './dto/update-finance-cliente.dto';

@Controller('finance/clientes')
@UseGuards(JwtAuthGuard)
export class FinanceClienteController {
  constructor(private readonly service: FinanceClienteService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateFinanceClienteDto) {
    return this.service.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Request() req, @Query('todos') todos?: string) {
    const apenasAtivos = todos !== 'true';
    return this.service.findAll(req.user.id, apenasAtivos);
  }

  @Get('buscar')
  search(@Request() req, @Query('q') termo: string) {
    return this.service.search(req.user.id, termo);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.service.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateFinanceClienteDto) {
    return this.service.update(+id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.service.remove(+id, req.user.id);
  }
}
