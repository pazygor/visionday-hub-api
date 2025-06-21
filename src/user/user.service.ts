import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // ajuste se o caminho for diferente
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    return this.prisma.usuario.create({
      data: {
        ...createUserDto,
        senha: hashedPassword,
      },
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        empresaId: true,
        nome: true,
        email: true,
        imagem: true,
        permissao: true,
        updatedAt: true,
        createdAt: true,
        token: true,
        ativo: true,
        loginAtivo: true,
        motivo: true,
        validade: true,
        perfil: true,
        celular: true,
        cadastro: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        empresaId: true,
        nome: true,
        email: true,
        imagem: true,
        permissao: true,
        updatedAt: true,
        createdAt: true,
        token: true,
        ativo: true,
        loginAtivo: true,
        motivo: true,
        validade: true,
        perfil: true,
        celular: true,
        cadastro: true,
        senha: true
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let dataToUpdate = { ...updateUserDto };

    if (updateUserDto.senha) {
      const hashedPassword = await bcrypt.hash(updateUserDto.senha, 10);
      dataToUpdate.senha = hashedPassword;
    }

    return this.prisma.usuario.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
