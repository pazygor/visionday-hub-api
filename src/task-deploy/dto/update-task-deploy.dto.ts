import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDeployDto } from './create-task-deploy.dto';

export class UpdateTaskDeployDto extends PartialType(CreateTaskDeployDto) {}
