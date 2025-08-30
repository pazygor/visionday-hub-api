import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServersDeployService } from './servers-deploy.service';
import { CreateServersDeployDto } from './dto/create-servers-deploy.dto';
import { UpdateServersDeployDto } from './dto/update-servers-deploy.dto';

@Controller('servers-deploy')
export class ServersDeployController {
  constructor(private readonly serversDeployService: ServersDeployService) {}

  @Post()
  create(@Body() createServersDeployDto: CreateServersDeployDto) {
    return this.serversDeployService.create(createServersDeployDto);
  }

  @Get()
  findAll() {
    return this.serversDeployService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serversDeployService.findOne(+id);
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
