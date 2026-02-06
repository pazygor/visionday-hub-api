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
      include: {
        permissao: true,
        usuarioSistemas: {
          where: { ativo: true },
          include: {
            produtoSistema: true
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    if (!user.ativo) {
      throw new UnauthorizedException('Usuário inativo');
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
      permissaoId: user.permissaoId,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Extrair códigos dos sistemas para o frontend
    const systems = user.usuarioSistemas.map(us => us.produtoSistema.codigo);

    return {
      token: access_token,
      refreshToken: refresh_token,
      user: {
        id: user.id.toString(),
        name: user.nome,
        email: user.email,
        role: user.permissao.nome,
        systems: systems, // ['digital', 'finance', 'academy']
      },
    };
  }
}