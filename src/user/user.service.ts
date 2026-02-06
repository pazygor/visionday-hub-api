import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // ajuste se o caminho for diferente
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const {
      produtosPermitidos = [], // Array de produtoId
      sistemasPermitidos = [], // Novo array de produtoSistemaId
      senha,
      ...userData
    } = createUserDto;

    const hashedPassword = await bcrypt.hash(senha, 10);

    // 1. Cria o usuário
    const novoUsuario = await this.prisma.usuario.create({
      data: {
        ...userData,
        senha: hashedPassword,
      },
    });

    // 2. Cria os relacionamentos com produtos (usuario_produto)
    // if (produtosPermitidos.length > 0) {
    //   await this.prisma.usuarioProduto.createMany({
    //     data: produtosPermitidos.map((produtoId) => ({
    //       usuarioId: novoUsuario.id,
    //       produtoId,
    //     })),
    //     skipDuplicates: true,
    //   });
    // }

    // 3. Cria os relacionamentos com sistemas (usuario_produto_sistema)
    // if (sistemasPermitidos.length > 0) {
    //   await this.prisma.usuarioProdutoSistema.createMany({
    //     data: sistemasPermitidos.map((produtoSistemaId) => ({
    //       usuarioId: novoUsuario.id,
    //       produtoSistemaId,
    //     })),
    //     skipDuplicates: true,
    //   });
    // }

    return novoUsuario;
  }


  findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        permissao: true,
        updatedAt: true,
        createdAt: true,
        ativo: true,
        senha: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        permissao: true,
        updatedAt: true,
        createdAt: true,
        ativo: true,
        senha: true,
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
