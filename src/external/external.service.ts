import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ExportarExternalDto } from './dto/create-external.dto';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ExternalService {
  private readonly apiTerceiraUrl = 'https://shrill-bonus-51fe.pazygor080.workers.dev/';
  private readonly userToken = process.env.USER_TOKEN_API_TERCEIRA;
  // 👇 Aqui é onde armazenamos a URL por usuário
  private readonly urlDownloadMap = new Map<string, string>();
  constructor(private readonly http: HttpService, private readonly prisma: PrismaService) { }
  setDownloadUrl(userId: number, url: string) {
    this.urlDownloadMap.set(String(userId), url);
  }

  getDownloadUrl(userId: number): string | undefined {
    return this.urlDownloadMap.get(String(userId));
  }

  removeDownloadUrl(userId: number): void {
    this.urlDownloadMap.delete(String(userId));
  }
  async exportarDados(data: ExportarExternalDto, userId: number) {
    const monitoramentoId = data.id;
    console.log(monitoramentoId);
    const projMap = new Map(
      data.projetos.map(p => [p.id, { tenant: p.tenant, env: p.env }])
    );

    const payload = {
      help: 'INSERT dados machines. Para campo tipo senha, usar a regra {field e encrypt}',
      input_data: [
        {
          crud: 'INSERT',
          dbname: 'MACHINES',
          install: "PREPARE_INSTALL",
          ONDUPLICATE: 'update',
          data_info: data.servidores.map((srv) => {
            const pj = projMap.get(srv.projetoId)!;
            return {
              empresa_id: srv.empresaId,
              tenant: pj.tenant,
              env: pj.env,
              ip: srv.ip,
              username: srv.nomeUsuario,
              password: srv.senhaUsuario,
            };
          }),
          PK: ['empresa_id', 'tenant', 'env', 'ip'],
          RULES: [{ field: 'password', action: 'encrypt' }],
        },
      ],
    };

    const headers = { Authorization: `Bearer ${this.userToken}` };
    const response = await firstValueFrom(
      this.http.post(this.apiTerceiraUrl, payload, { headers })
    );
    const url = response.data?.data?.[0]?.value?.url_download;
    if (url) {
      // 3️⃣ atualiza no banco
      await this.prisma.monitoramento.update({
        where: { id: monitoramentoId },
        data: { url_download: url },
      });
    }

    return { sucesso: true };
  }
  async exportarDadosProtheus(data: ExportarExternalDto, userId: number) {
    const monitoramentoId = data.id;
    console.log(monitoramentoId);
    const projMap = new Map(
      data.projetos.map(p => [p.id, { tenant: p.tenant, env: p.env }])
    );

    const payload = {
      help: 'INSERT dados machines. Para campo tipo senha, usar a regra {field e encrypt}',
      input_data: [
        {
          crud: 'INSERT',
          dbname: 'MACHINES',
          install: "PREPARE_INSTALL",
          ONDUPLICATE: 'update',
          data_info: data.servidores.map((srv) => {
            const pj = projMap.get(srv.projetoId)!;
            return {
              empresa_id: srv.empresaId,
              tenant: pj.tenant,
              env: pj.env,
              ip: srv.ip,
              username: srv.nomeUsuario,
              password: srv.senhaUsuario,
            };
          }),
          PK: ['empresa_id', 'tenant', 'env', 'ip'],
          RULES: [{ field: 'password', action: 'encrypt' }],
        },
      ],
    };

    const headers = { Authorization: `Bearer ${this.userToken}` };
    const response = await firstValueFrom(
      this.http.post(this.apiTerceiraUrl, payload, { headers })
    );
    const url = response.data?.data?.[0]?.value?.url_download;
    if (url) {
      // 3️⃣ atualiza no banco
      await this.prisma.monitoramento.update({
        where: { id: monitoramentoId },
        data: { url_download: url },
      });
    }

    return { sucesso: true };
  }
  async baixarInstalador(monitoramentoId: number, res: Response): Promise<void> {
    // 1️⃣ Busca no banco
    const mon = await this.prisma.monitoramento.findUnique({
      where: { id: monitoramentoId },
      select: { url_download: true },
    });

    if (!mon?.url_download) {
      res.status(404).json({ erro: 'Arquivo não encontrado para este monitoramento.' });
      return;
    }

    // 2️⃣ Faz o GET com stream
    const fileResponse = await firstValueFrom(
      this.http.get(mon.url_download, { responseType: 'stream' })
    );

    // 3️⃣ Ajusta headers e faz pipe
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="instalador.zip"',
    });

    fileResponse.data.pipe(res);
  }
  async baixarInstaladorProtheus(monitoramentoId: number, res: Response): Promise<void> {
    // 1️⃣ Busca no banco
    const mon = await this.prisma.monitoramento.findUnique({
      where: { id: monitoramentoId },
      select: { url_download: true },
    });

    if (!mon?.url_download) {
      res.status(404).json({ erro: 'Arquivo não encontrado para este monitoramento.' });
      return;
    }

    // 2️⃣ Faz o GET com stream
    const fileResponse = await firstValueFrom(
      this.http.get(mon.url_download, { responseType: 'stream' })
    );

    // 3️⃣ Ajusta headers e faz pipe
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="instalador.zip"',
    });

    fileResponse.data.pipe(res);
  }
}
