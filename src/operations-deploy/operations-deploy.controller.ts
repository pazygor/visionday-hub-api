import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OperationsDeployService } from './operations-deploy.service';
import { CreateOperationsDeployDto } from './dto/create-operations-deploy.dto';
import { UpdateOperationsDeployDto } from './dto/update-operations-deploy.dto';

@Controller('operations-deploy')
export class OperationsDeployController {
  constructor(private readonly service: OperationsDeployService) { }

  @Post()
  create(@Body() dto: CreateOperationsDeployDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOperationsDeployDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
