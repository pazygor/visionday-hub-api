import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { AlertParamsService } from './alert-params.service';
import { CreateAlertParamDto } from './dto/create-alert-param.dto';
import { UpdateAlertParamDto } from './dto/update-alert-param.dto';
import { ExternalAlertArrayDto } from './dto/external-alert.dto';
@Controller('alert-params')
export class AlertParamsController {
  constructor(private readonly alertParamsService: AlertParamsService) { }

  @Post()
  create(@Body() createAlertParamDto: CreateAlertParamDto) {
    return this.alertParamsService.create(createAlertParamDto);
  }

  @Get()
  findAll() {
    return this.alertParamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertParamsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertParamDto: UpdateAlertParamDto) {
    return this.alertParamsService.update(+id, updateAlertParamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertParamsService.remove(+id);
  }

  @Post('save_infra_parameters')
  async saveOrUpdate(@Body() alertParams: CreateAlertParamDto[]) {
    if (!Array.isArray(alertParams) || alertParams.length === 0) {
      throw new BadRequestException('Payload inválido.');
    }

    const serverId = alertParams[0].serverId;
    return this.alertParamsService.saveOrUpdateAll(alertParams, serverId);
  }
  // src/alert-params/alert-params.controller.ts
  @Post('incoming-alerts')
  async handleIncoming(
    @Body() { alerts }: ExternalAlertArrayDto,
  ) {
    if (!alerts.length) {
      throw new BadRequestException('Payload vazio');
    }
    return this.alertParamsService.processExternalAlerts(alerts);
  }
}
