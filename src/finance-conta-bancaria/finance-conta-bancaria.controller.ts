import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceContaBancariaService } from './finance-conta-bancaria.service';
import { CreateFinanceContaBancariaDto } from './dto/create-finance-conta-bancaria.dto';
import { UpdateFinanceContaBancariaDto } from './dto/update-finance-conta-bancaria.dto';

@Controller('finance/contas-bancarias')
@UseGuards(JwtAuthGuard)
export class FinanceContaBancariaController {
  constructor(private readonly service: FinanceContaBancariaService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateFinanceContaBancariaDto) {
    return this.service.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.service.findAll(req.user.id);
  }

  @Get('principal')
  getPrincipal(@Request() req) {
    return this.service.getPrincipal(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.service.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateFinanceContaBancariaDto) {
    return this.service.update(+id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.service.remove(+id, req.user.id);
  }
}
