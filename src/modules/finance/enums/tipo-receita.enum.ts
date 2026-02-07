export enum TipoReceita {
  CLIENTE = 'cliente',
  SALARIO = 'salario',
  FREELANCE = 'freelance',
  ALUGUEL = 'aluguel',
  VENDA = 'venda',
  INVESTIMENTO = 'investimento',
  BONIFICACAO = 'bonificacao',
  OUTRO = 'outro',
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
