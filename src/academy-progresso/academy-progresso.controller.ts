/**
 * VISIONDAY ACADEMY - PROGRESSO CONTROLLER
 * Controller para gerenciamento de progresso
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AcademyProgressoService } from './academy-progresso.service';
import { UpdateProgressoDto, MarkAsCompleteDto } from './dto';

@Controller('academy/progresso')
@UseGuards(JwtAuthGuard)
export class AcademyProgressoController {
  constructor(private readonly progressoService: AcademyProgressoService) {}

  /**
   * Atualizar progresso de uma aula
   * POST /academy/progresso/:matriculaId
   */
  @Post(':matriculaId')
  updateProgress(
    @Request() req,
    @Param('matriculaId') matriculaId: string,
    @Body() updateProgressoDto: UpdateProgressoDto,
  ) {
    const usuarioId = req.user.id;
    return this.progressoService.updateProgress(usuarioId, +matriculaId, updateProgressoDto);
  }

  /**
   * Marcar aula como concluída
   * PUT /academy/progresso/:matriculaId/complete
   */
  @Put(':matriculaId/complete')
  markAsComplete(
    @Request() req,
    @Param('matriculaId') matriculaId: string,
    @Body() markAsCompleteDto: MarkAsCompleteDto,
  ) {
    const usuarioId = req.user.id;
    return this.progressoService.markAsComplete(usuarioId, +matriculaId, markAsCompleteDto);
  }

  /**
   * Obter progresso completo de um curso
   * GET /academy/progresso/:matriculaId
   */
  @Get(':matriculaId')
  getCourseProgress(@Request() req, @Param('matriculaId') matriculaId: string) {
    const usuarioId = req.user.id;
    return this.progressoService.getCourseProgress(usuarioId, +matriculaId);
  }

  /**
   * Obter progresso de uma aula específica
   * GET /academy/progresso/:matriculaId/aula/:aulaId
   */
  @Get(':matriculaId/aula/:aulaId')
  getLessonProgress(
    @Request() req,
    @Param('matriculaId') matriculaId: string,
    @Param('aulaId') aulaId: string,
  ) {
    const usuarioId = req.user.id;
    return this.progressoService.getLessonProgress(usuarioId, +matriculaId, +aulaId);
  }

  /**
   * Obter próxima aula a ser assistida
   * GET /academy/progresso/:matriculaId/next-lesson
   */
  @Get(':matriculaId/next-lesson')
  getNextLesson(@Request() req, @Param('matriculaId') matriculaId: string) {
    const usuarioId = req.user.id;
    return this.progressoService.getNextLesson(usuarioId, +matriculaId);
  }
}
