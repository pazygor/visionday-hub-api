export enum TipoReceita {
  CLIENTE = 'CLIENTE',
  SALARIO = 'SALARIO',
  FREELANCE = 'FREELANCE',
  ALUGUEL = 'ALUGUEL',
  VENDA = 'VENDA',
  INVESTIMENTO = 'INVESTIMENTO',
  BONIFICACAO = 'BONIFICACAO',
  OUTRO = 'OUTRO',
}

export const TipoReceitaLabels: Record<TipoReceita, string> = {
  [TipoReceita.CLIENTE]: 'Cliente',
  [TipoReceita.SALARIO]: 'Salário',
  [TipoReceita.FREELANCE]: 'Freelance/Autônomo',
  [TipoReceita.ALUGUEL]: 'Aluguel Recebido',
  [TipoReceita.VENDA]: 'Venda de Bem',
  [TipoReceita.INVESTIMENTO]: 'Investimento Resgatado',
  [TipoReceita.BONIFICACAO]: 'Bonificação/Prêmio',
  [TipoReceita.OUTRO]: 'Outro',
};
