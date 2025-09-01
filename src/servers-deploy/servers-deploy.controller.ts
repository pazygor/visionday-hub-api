import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe } from '@nestjs/common';
import { ServersDeployService } from './servers-deploy.service';
import { CreateServersDeployDto } from './dto/create-servers-deploy.dto';
import { UpdateServersDeployDto } from './dto/update-servers-deploy.dto';

@Controller('servers-deploy')
export class ServersDeployController {
  constructor(private readonly serversDeployService: ServersDeployService) { }

  @Post()
  create(@Body() createServersDeployDto: CreateServersDeployDto) {
    return this.serversDeployService.create(createServersDeployDto);
  }

  @Get()
  findAll(@Query('empresaId') empresaId: string) {
    return this.serversDeployService.findAll(Number(empresaId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serversDeployService.findOne(+id);
  }

  @Get('by_empresa_id/:empresaId')
  async findByEmpresa(
    @Param('empresaId', ParseIntPipe) empresaId: number,
  ) {
    return this.serversDeployService.findByEmpresa(empresaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServersDeployDto: UpdateServersDeployDto) {
    return this.serversDeployService.update(+id, updateServersDeployDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serversDeployService.remove(+id);
  }
}
