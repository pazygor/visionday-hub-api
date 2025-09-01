import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskDeployService } from './task-deploy.service';
import { CreateTaskDeployDto } from './dto/create-task-deploy.dto';
import { UpdateTaskDeployDto } from './dto/update-task-deploy.dto';

@Controller('task-deploy')
export class TaskDeployController {
  constructor(private readonly taskDeployService: TaskDeployService) { }

  @Post()
  create(@Body() createTaskDeployDto: CreateTaskDeployDto) {
    return this.taskDeployService.create(createTaskDeployDto);
  }

  @Get()
  findAll() {
    return this.taskDeployService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskDeployService.findOne(+id);
  // }
  @Get('by_empresa_id/:empresaId')
  findByEmpresa(@Param('empresaId') empresaId: string) {
    return this.taskDeployService.findByEmpresa(+empresaId);
  }
  @Patch(':empresaId/:codtsk')
  update(
    @Param('empresaId') empresaId: string,
    @Param('codtsk') codtsk: string,
    @Body() updateTaskDeployDto: UpdateTaskDeployDto,
  ) {
    return this.taskDeployService.update(+empresaId, +codtsk, updateTaskDeployDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.taskDeployService.remove(+id);
  // }
  @Delete(':empresaId/:codtsk')
  deleteTask(
    @Param('empresaId') empresaId: number,
    @Param('codtsk') codtsk: number,
  ) {
    return this.taskDeployService.deleteTask(+empresaId, +codtsk);
  }
}
