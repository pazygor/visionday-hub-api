import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceFornecedorService } from './finance-fornecedor.service';
import { CreateFinanceFornecedorDto } from './dto/create-finance-fornecedor.dto';
import { UpdateFinanceFornecedorDto } from './dto/update-finance-fornecedor.dto';

@Controller('finance/fornecedores')
@UseGuards(JwtAuthGuard)
export class FinanceFornecedorController {
  constructor(private readonly service: FinanceFornecedorService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateFinanceFornecedorDto) {
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
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateFinanceFornecedorDto) {
    return this.service.update(+id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.service.remove(+id, req.user.id);
  }
}
