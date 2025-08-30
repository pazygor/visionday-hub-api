import { Injectable } from '@nestjs/common';
import { CreateTaskDeployDto } from './dto/create-task-deploy.dto';
import { UpdateTaskDeployDto } from './dto/update-task-deploy.dto';

@Injectable()
export class TaskDeployService {
  create(createTaskDeployDto: CreateTaskDeployDto) {
    return 'This action adds a new taskDeploy';
  }

  findAll() {
    return `This action returns all taskDeploy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskDeploy`;
  }

  update(id: number, updateTaskDeployDto: UpdateTaskDeployDto) {
    return `This action updates a #${id} taskDeploy`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskDeploy`;
  }
}
