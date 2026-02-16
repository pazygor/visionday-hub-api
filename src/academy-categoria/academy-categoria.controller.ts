import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AcademyCategoriaService } from './academy-categoria.service';

@Controller('academy/categorias')
export class AcademyCategoriaController {
  constructor(private readonly categoriaService: AcademyCategoriaService) {}

  /**
   * Listar todas as categorias
   * GET /academy/categorias
   */
  @Get()
  findAll() {
    return this.categoriaService.findAll();
  }

  /**
   * Buscar categoria por slug
   * GET /academy/categorias/slug/:slug
   */
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriaService.findBySlug(slug);
  }

  /**
   * Buscar categoria por ID
   * GET /academy/categorias/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.findOne(id);
  }
}
