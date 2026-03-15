/**
 * VISIONDAY ACADEMY - MATRICULA CONTROLLER
 * Controller para gerenciamento de matrículas
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AcademyMatriculaService } from './academy-matricula.service';
import { CreateMatriculaDto, UpdateMatriculaDto } from './dto';

@Controller('academy/matriculas')
@UseGuards(JwtAuthGuard)
export class AcademyMatriculaController {
  constructor(private readonly matriculaService: AcademyMatriculaService) {}

  /**
   * Criar nova matrícula
   * POST /academy/matriculas
   */
  @Post()
  create(@Request() req, @Body() createMatriculaDto: CreateMatriculaDto) {
    const usuarioId = req.user.id;
    return this.matriculaService.create(usuarioId, createMatriculaDto);
  }

  /**
   * Listar todas as matrículas do usuário
   * GET /academy/matriculas?status=ATIVA&favorito=true
   */
  @Get()
  findAll(
    @Request() req,
    @Query('status') status?: string,
    @Query('favorito') favorito?: string,
  ) {
    const usuarioId = req.user.id;
    const favoritoBoolean = favorito === 'true' ? true : favorito === 'false' ? false : undefined;
    return this.matriculaService.findAll(usuarioId, status, favoritoBoolean);
  }

  /**
   * Estatísticas do usuário
   * GET /academy/matriculas/stats
   */
  @Get('stats')
  getStats(@Request() req) {
    const usuarioId = req.user.id;
    return this.matriculaService.getStats(usuarioId);
  }

  /**
   * Continuar assistindo
   * GET /academy/matriculas/continue-watching
   */
  @Get('continue-watching')
  getContinueWatching(@Request() req, @Query('limit') limit?: string) {
    const usuarioId = req.user.id;
    const limitNumber = limit ? parseInt(limit, 10) : 3;
    return this.matriculaService.getContinueWatching(usuarioId, limitNumber);
  }

  /**
   * Verificar se está matriculado em um curso
   * GET /academy/matriculas/check/:cursoId
   */
  @Get('check/:cursoId')
  async checkEnrollment(@Request() req, @Param('cursoId') cursoId: string) {
    const usuarioId = req.user.id;
    const isEnrolled = await this.matriculaService.isEnrolled(usuarioId, +cursoId);
    return { isEnrolled };
  }

  /**
   * Obter matrícula por curso
   * GET /academy/matriculas/curso/:cursoId
   */
  @Get('curso/:cursoId')
  getByUserAndCourse(@Request() req, @Param('cursoId') cursoId: string) {
    const usuarioId = req.user.id;
    return this.matriculaService.getByUserAndCourse(usuarioId, +cursoId);
  }

  /**
   * Buscar matrícula específica
   * GET /academy/matriculas/:id
   */
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const usuarioId = req.user.id;
    return this.matriculaService.findOne(+id, usuarioId);
  }

  /**
   * Atualizar matrícula (favorito)
   * PATCH /academy/matriculas/:id
   */
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMatriculaDto: UpdateMatriculaDto,
  ) {
    const usuarioId = req.user.id;
    return this.matriculaService.update(+id, usuarioId, updateMatriculaDto);
  }

  /**
   * Cancelar matrícula
   * DELETE /academy/matriculas/:id
   */
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const usuarioId = req.user.id;
    return this.matriculaService.remove(+id, usuarioId);
  }

  /**
   * Dashboard: Estatísticas completas
   * GET /academy/dashboard/stats
   */
  @Get('dashboard/stats')
  getDashboardStats(@Request() req) {
    const usuarioId = req.user.id;
    return this.matriculaService.getDashboardStats(usuarioId);
  }

  /**
   * Dashboard: Continuar assistindo
   * GET /academy/dashboard/continue-watching
   */
  @Get('dashboard/continue-watching')
  getDashboardContinueWatching(@Request() req, @Query('limit') limit?: string) {
    const usuarioId = req.user.id;
    const limitNumber = limit ? parseInt(limit, 10) : 4;
    return this.matriculaService.getDashboardContinueWatching(usuarioId, limitNumber);
  }

  /**
   * Dashboard: Cursos recomendados
   * GET /academy/dashboard/recommended
   */
  @Get('dashboard/recommended')
  getRecommendedCourses(@Request() req, @Query('limit') limit?: string) {
    const usuarioId = req.user.id;
    const limitNumber = limit ? parseInt(limit, 10) : 4;
    return this.matriculaService.getRecommendedCourses(usuarioId, limitNumber);
  }
}
