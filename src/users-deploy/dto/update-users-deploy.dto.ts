import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDeployDto } from './create-users-deploy.dto';

export class UpdateUsersDeployDto extends PartialType(CreateUsersDeployDto) {}
