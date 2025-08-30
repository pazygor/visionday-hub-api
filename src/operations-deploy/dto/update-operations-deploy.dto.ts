import { PartialType } from '@nestjs/mapped-types';
import { CreateOperationsDeployDto } from './create-operations-deploy.dto';

export class UpdateOperationsDeployDto extends PartialType(CreateOperationsDeployDto) {}
