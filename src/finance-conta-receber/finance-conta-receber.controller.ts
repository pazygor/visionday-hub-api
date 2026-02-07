import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Put,
  Param, 
  Delete, 
  UseGuards, 
  Request, 
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceContaReceberService, FiltrosContaReceber } from './finance-conta-receber.service';
import { CreateFinanceContaReceberDto } from './dto/create-finance-conta-receber.dto';
import { UpdateFinanceContaReceberDto } from './dto/update-finance-conta-receber.dto';
import { RegistrarPagamentoDto } from './dto/registrar-pagamento.dto';
import { TipoReceita } from '../modules/finance/enums/tipo-receita.enum';

@Controller('finance/contas-receber')
@UseGuards(JwtAuthGuard)
export class FinanceContaReceberController {
  constructor(private readonly service: FinanceContaReceberService) {}

  /**
   * GET /finance/contas-receber/resumo
   * IMPORTANTE: Deve vir ANTES de GET /:id para evitar conflito
   */
  @Get('resumo')
  getResumo(@Request() req) {
    return this.service.getResumo(req.user.userId);
  }

  /**
   * GET /finance/contas-receber
   * Lista com filtros expandidos incluindo tipo
   */
  @Get()
  findAll(
    @Request() req,
    @Query('tipo') tipo?: TipoReceita | TipoReceita[],
    @Query('status') status?: string | string[],
    @Query('clienteId') clienteId?: string,
    @Query('categoriaId') categoriaId?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('recorrente') recorrente?: string,
    @Query('busca') busca?: string,
  ) {
    const filtros: FiltrosContaReceber = {};

    // Processar filtros
    if (tipo) {
      filtros.tipo = tipo;
    }

    if (status) {
      filtros.status = status;
    }

    if (clienteId) {
      filtros.clienteId = parseInt(clienteId);
    }

    if (categoriaId) {
      filtros.categoriaId = parseInt(categoriaId);
    }

    if (dataInicio) {
      filtros.dataInicio = new Date(dataInicio);
    }

    if (dataFim) {
      filtros.dataFim = new Date(dataFim);
    }

    if (recorrente !== undefined) {
      filtros.recorrente = recorrente === 'true';
    }

    if (busca) {
      filtros.busca = busca;
    }

    return this.service.findAll(req.user.userId, filtros);
  }

  /**
   * GET /finance/contas-receber/:id
   */
  @Get(':id')
  findOne(
    @Request() req, 
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id, req.user.userId);
  }

  /**
   * POST /finance/contas-receber
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Request() req, 
    @Body() createDto: CreateFinanceContaReceberDto,
  ) {
    return this.service.create(req.user.userId, createDto, req.user.userId);
  }

  /**
   * PUT /finance/contas-receber/:id
   * Alterado de @Patch para @Put para consistência com a spec
   */
  @Put(':id')
  update(
    @Request() req, 
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDto: UpdateFinanceContaReceberDto,
  ) {
    return this.service.update(id, req.user.userId, updateDto, req.user.userId);
  }

  /**
   * POST /finance/contas-receber/:id/pagamento
   */
  @Post(':id/pagamento')
  @HttpCode(HttpStatus.OK)
  registrarPagamento(
    @Request() req, 
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: RegistrarPagamentoDto,
  ) {
    return this.service.registrarPagamento(id, req.user.userId, dto);
  }

  /**
   * DELETE /finance/contas-receber/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Request() req, 
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(id, req.user.userId);
  }
}

