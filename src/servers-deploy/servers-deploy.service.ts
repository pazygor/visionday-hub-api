import { Injectable } from '@nestjs/common';
import { CreateServersDeployDto } from './dto/create-servers-deploy.dto';
import { UpdateServersDeployDto } from './dto/update-servers-deploy.dto';

@Injectable()
export class ServersDeployService {
  create(createServersDeployDto: CreateServersDeployDto) {
    return 'This action adds a new serversDeploy';
  }

  findAll() {
    return `This action returns all serversDeploy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serversDeploy`;
  }

  update(id: number, updateServersDeployDto: UpdateServersDeployDto) {
    return `This action updates a #${id} serversDeploy`;
  }

  remove(id: number) {
    return `This action removes a #${id} serversDeploy`;
  }
}
