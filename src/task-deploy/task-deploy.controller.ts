import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskDeployService } from './task-deploy.service';
import { CreateTaskDeployDto } from './dto/create-task-deploy.dto';
import { UpdateTaskDeployDto } from './dto/update-task-deploy.dto';

@Controller('task-deploy')
export class TaskDeployController {
  constructor(private readonly taskDeployService: TaskDeployService) {}

  @Post()
  create(@Body() createTaskDeployDto: CreateTaskDeployDto) {
    return this.taskDeployService.create(createTaskDeployDto);
  }

  @Get()
  findAll() {
    return this.taskDeployService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskDeployService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDeployDto: UpdateTaskDeployDto) {
    return this.taskDeployService.update(+id, updateTaskDeployDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskDeployService.remove(+id);
  }
}
