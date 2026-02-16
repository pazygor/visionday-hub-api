import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AcademyCursoService } from './academy-curso.service';
import { CreateCursoDto, UpdateCursoDto, CursoFilterDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('academy/cursos')
export class AcademyCursoController {
  constructor(private readonly cursoService: AcademyCursoService) {}

  /**
   * Listar todos os cursos com filtros
   * GET /academy/cursos?busca=contabilidade&categoriaId=1&page=1&limit=12
   */
  @Get()
  findAll(@Query() filters: CursoFilterDto) {
    return this.cursoService.findAll(filters);
  }

  /**
   * Buscar cursos em destaque
   * GET /academy/cursos/destaque
   */
  @Get('destaque')
  findDestaque(@Query('limit', ParseIntPipe) limit?: number) {
    return this.cursoService.findDestaque(limit);
  }

  /**
   * Buscar curso por slug
   * GET /academy/cursos/slug/:slug
   */
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.cursoService.findBySlug(slug);
  }

  /**
   * Buscar curso por ID
   * GET /academy/cursos/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cursoService.findOne(id);
  }

  /**
   * Criar novo curso (admin apenas)
   * POST /academy/cursos
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursoService.create(createCursoDto);
  }

  /**
   * Atualizar curso (admin apenas)
   * PATCH /academy/cursos/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCursoDto: UpdateCursoDto,
  ) {
    return this.cursoService.update(id, updateCursoDto);
  }

  /**
   * Toggle publicado (admin apenas)
   * PATCH /academy/cursos/:id/toggle-publicado
   */
  @Patch(':id/toggle-publicado')
  @UseGuards(JwtAuthGuard)
  togglePublicado(@Param('id', ParseIntPipe) id: number) {
    return this.cursoService.togglePublicado(id);
  }

  /**
   * Toggle destaque (admin apenas)
   * PATCH /academy/cursos/:id/toggle-destaque
   */
  @Patch(':id/toggle-destaque')
  @UseGuards(JwtAuthGuard)
  toggleDestaque(@Param('id', ParseIntPipe) id: number) {
    return this.cursoService.toggleDestaque(id);
  }

  /**
   * Deletar curso (admin apenas)
   * DELETE /academy/cursos/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cursoService.remove(id);
  }
}
