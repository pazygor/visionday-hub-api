import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, senha: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
      // include: {
      //   usuarioProdutoSistemas: { // relação usuario_produto_sistema
      //     include: {
      //       produtoSistema: true // pega os detalhes do produto
      //     }
      //   }
      // }
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.senha);

    const payload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
      empresaId: user.empresaId,
      permissaoId: user.permissaoId,
    };

    const access_token = this.jwtService.sign(payload);

    // Extrair só os produtosSistema para enviar no retorno
    //const produtosSistema = user.usuarioProdutoSistemas.map(up => up.produtoSistema);

    return {
      access_token,
      //produtosSistema,
    };
  }
}