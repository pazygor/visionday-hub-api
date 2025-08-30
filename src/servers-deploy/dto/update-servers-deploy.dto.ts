import { PartialType } from '@nestjs/mapped-types';
import { CreateServersDeployDto } from './create-servers-deploy.dto';

export class UpdateServersDeployDto extends PartialType(CreateServersDeployDto) {}
