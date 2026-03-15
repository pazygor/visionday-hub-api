/**
 * VISIONDAY ACADEMY - CERTIFICADO CONTROLLER
 * Endpoints para gerenciamento de certificados
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AcademyCertificadoService } from './academy-certificado.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GenerateCertificadoDto } from './dto';

@Controller('academy/certificados')
export class AcademyCertificadoController {
  constructor(
    private readonly academyCertificadoService: AcademyCertificadoService,
  ) {}

  /**
   * Gerar certificado
   * POST /academy/certificados/generate
   */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Request() req, @Body() generateDto: GenerateCertificadoDto) {
    const usuarioId = req.user.userId;
    return this.academyCertificadoService.generate(usuarioId, generateDto);
  }

  /**
   * Listar certificados do usuário
   * GET /academy/certificados/meus
   */
  @Get('meus')
  @UseGuards(JwtAuthGuard)
  async findMyCertificados(@Request() req) {
    const usuarioId = req.user.userId;
    return this.academyCertificadoService.findByUser(usuarioId);
  }

  /**
   * Buscar certificado por código
   * GET /academy/certificados/:codigo
   */
  @Get(':codigo')
  @UseGuards(JwtAuthGuard)
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.academyCertificadoService.findByCodigo(codigo);
  }

  /**
   * Download do certificado
   * GET /academy/certificados/:codigo/download
   */
  @Get(':codigo/download')
  @UseGuards(JwtAuthGuard)
  async download(@Request() req, @Param('codigo') codigo: string) {
    const usuarioId = req.user.userId;
    return this.academyCertificadoService.download(usuarioId, codigo);
  }

  /**
   * Validar certificado (público - sem autenticação)
   * GET /academy/certificados/validate/:hash
   */
  @Get('validate/:hash')
  async validate(@Param('hash') hash: string) {
    return this.academyCertificadoService.validate(hash);
  }
}
