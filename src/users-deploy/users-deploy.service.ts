import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsersDeployDto } from './dto/create-users-deploy.dto';
import { UpdateUsersDeployDto } from './dto/update-users-deploy.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service'; // Service padrão de usuarios

@Injectable()
export class UsersDeployService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService, // Service padrão de usuários
  ) { }

  async create(dto: CreateUsersDeployDto) {
    // 1️⃣ Criação do usuário na tabela padrão 'usuarios'
    const novoUsuario = await this.userService.create({
      nome: dto.DP0_OPER,
      empresaId: dto.empresaId,
      email: dto.DP0_EMAIL,
      senha: dto.DP0_SENHA, // UserService fará hash
      permissaoId: dto.permissaoId,
      ativo: true,
      loginAtivo: true,
      sistemasPermitidos: [2], // acesso exclusivo ao Deploy
      // outros campos default, se precisar
    });

    // 2️⃣ Criação do usuário na tabela DP0, agora com o usuarioId
    const novoUserDeploy = await this.prisma.dP0.create({
      data: {
        empresaId: dto.empresaId,
        oper: dto.DP0_OPER,
        email: dto.DP0_EMAIL,
        senha: novoUsuario.senha, // já vem hash da tabela usuario
        permissaoId: dto.permissaoId,
        grants: dto.DP0_GRANTS,
        usergi: dto.DP0_USERGI,
        userga: dto.DP0_USERGA,
        usuarioId: novoUsuario.id, // FK para tabela usuario
      },
    });

    return novoUserDeploy;
  }

  async findAll() {
    return this.prisma.dP0.findMany();
  }
  async findByEmpresaId(empresaId: number) {
    return this.prisma.dP0.findMany({
      where: { empresaId },
      orderBy: { oper: 'asc' }, // opcional: ordena pelo nome
    });
  }
  async findOne(id: number) {
    const user = await this.prisma.dP0.findUnique({
      where: { id: id },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUsersDeployDto) {
    // 1️⃣ Buscar o registro dP0
    const dp0Record = await this.prisma.dP0.findUnique({
      where: { id },
      select: { usuarioId: true }
    });

    if (!dp0Record) {
      throw new NotFoundException('Registro DP0 não encontrado');
    }

    const usuarioId = dp0Record.usuarioId;

    // 2️⃣ Atualizar a tabela usuarios
    if (!usuarioId) {
      throw new NotFoundException('Usuário vinculado não encontrado');
    }

    let hashedPassword;
    if (dto.DP0_SENHA) {
      hashedPassword = await bcrypt.hash(dto.DP0_SENHA, 10);
    }

    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        nome: dto.DP0_OPER,
        empresaId: dto.empresaId,
        email: dto.DP0_EMAIL,
        senha: hashedPassword, // se undefined, o Prisma ignora
        permissaoId: dto.permissaoId,
        ativo: true,
        loginAtivo: true,
      }
    });

    // 3️⃣ Atualizar a tabela DP0
    return this.prisma.dP0.update({
      where: { id: id },
      data: {
        empresaId: dto.empresaId,
        oper: dto.DP0_OPER,
        email: dto.DP0_EMAIL,
        senha: hashedPassword, // hash replicado
        permissaoId: dto.permissaoId,
        grants: dto.DP0_GRANTS,
        usergi: dto.DP0_USERGI,
        userga: dto.DP0_USERGA,
      },
    });
  }

  async remove(id: number) {
    // 1. Buscar o registro na tabela dp0
    const dp0Record = await this.prisma.dP0.findUnique({
      where: { id },
      select: { usuarioId: true } // só precisamos do usuario_id
    });

    if (!dp0Record) {
      throw new NotFoundException('Usuário não encontrado na DP0');
    }

    const usuarioId = dp0Record.usuarioId;

    // 2. Deletar o registro na dp0
    await this.prisma.dP0.delete({
      where: { id },
    });
    if (!usuarioId) {
      throw new NotFoundException('Usuário vinculado não encontrado');
    }
    // 3. Deletar o usuário na tabela padrão
    await this.userService.remove(usuarioId);
    // await this.prisma.usuario.delete({
    //   where: { id: usuarioId },
    // });

    return { message: 'Usuário excluído com sucesso' };
  }
}
