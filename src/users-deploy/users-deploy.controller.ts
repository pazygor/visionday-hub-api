import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersDeployService } from './users-deploy.service';
import { CreateUsersDeployDto } from './dto/create-users-deploy.dto';
import { UpdateUsersDeployDto } from './dto/update-users-deploy.dto';

@Controller('users-deploy')
export class UsersDeployController {
  constructor(private readonly usersDeployService: UsersDeployService) { }

  @Post()
  create(@Body() createUsersDeployDto: CreateUsersDeployDto) {
    return this.usersDeployService.create(createUsersDeployDto);
  }

  @Get()
  findAll() {
    return this.usersDeployService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersDeployService.findOne(+id);
  }
  @Get('by_empresa_id/:empresaId')
  async findByEmpresaId(@Param('empresaId') empresaId: string) {
    const id = parseInt(empresaId, 10);
    return this.usersDeployService.findByEmpresaId(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersDeployDto: UpdateUsersDeployDto) {
    return this.usersDeployService.update(+id, updateUsersDeployDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersDeployService.remove(+id);
  }
}
