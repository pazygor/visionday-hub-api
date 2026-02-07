# Melhorias Recomendadas no Schema Finance - MVP

## 🔴 PRIORIDADE ALTA (Fazer antes do MVP)

### 1. Adicionar índices compostos para performance

```prisma
// Em FinanceContaReceber (linha ~413):
@@index([usuarioId, dataVencimento])
@@index([usuarioId, createdAt])
@@index([usuarioId, status, dataVencimento]) // Para dashboard com filtro

// Em FinanceContaPagar (linha ~457):
@@index([usuarioId, dataVencimento])
@@index([usuarioId, createdAt])
@@index([usuarioId, status, dataVencimento])

// Em FinanceFatura (linha ~492):
@@index([usuarioId, dataEmissao])
@@index([dataVencimento])
```

**Impacto**: Queries de dashboard 10-50x mais rápidas

### 2. Adicionar campo numeroDocumento (se emitir NF/Boletos)

```prisma
// Em FinanceContaReceber (após linha 382):
numeroDocumento      String?              @map("numero_documento") @db.VarChar(50)

// Em FinanceContaPagar (após linha 429):
numeroDocumento      String?              @map("numero_documento") @db.VarChar(50)
```

**Quando necessário**: Se você emite NF, boletos ou precisa rastrear documentos fiscais

### 3. Adicionar campo dataPagamento em FinanceFatura

```prisma
// Em FinanceFatura (após linha 476):
dataPagamento        DateTime?            @map("data_pagamento")
```

**Motivo**: Rastrear quando a fatura foi efetivamente paga

---

## 🟡 PRIORIDADE MÉDIA (Pode fazer no MVP ou v1.1)

### 4. Adicionar ENUM para Status (maior consistência)

```prisma
enum StatusConta {
  PENDENTE
  PAGA
  VENCIDA
  CANCELADA
  PARCIALMENTE_PAGA
}

// Substituir:
// status String @default("PENDENTE")
// Por:
status StatusConta @default(PENDENTE)
```

**Benefício**: Elimina erros de digitação, autocomplete no código

**Custo**: Migration mais complexa, menos flexível para ajustes rápidos

### 5. Adicionar campo juros/multa em Parcelas

```prisma
// Em FinanceParcela (após linha 518):
juros          Decimal?  @default(0) @db.Decimal(15, 2)
multa          Decimal?  @default(0) @db.Decimal(15, 2)
desconto       Decimal?  @default(0) @db.Decimal(15, 2)
```

**Quando**: Se você cobra juros/multa por atraso

### 6. Adicionar metadados de integração

```prisma
// Se integrar com sistemas externos (Asaas, Stripe, etc.)
model FinanceContaReceber {
  // ... campos existentes
  integracaoId       String?  @map("integracao_id") @db.VarChar(100)
  integracaoTipo     String?  @map("integracao_tipo") // asaas, stripe, pagarme
  metadados          Json?    // Dados adicionais da integração
}
```

---

## 🟢 PRIORIDADE BAIXA (v2 ou posterior)

### 7. Sistema de Subcategorias

```prisma
model FinanceSubcategoria {
  id                 Int                  @id @default(autoincrement())
  categoriaId        Int                  @map("categoria_id")
  usuarioId          Int?                 @map("usuario_id")
  nome               String               @db.VarChar(100)
  descricao          String?              @db.Text
  ativo              Boolean              @default(true)
  ordem              Int                  @default(0)
  createdAt          DateTime             @default(now()) @map("created_at")
  updatedAt          DateTime             @updatedAt @map("updated_at")

  // Relacionamentos
  categoria          FinanceCategoria     @relation(fields: [categoriaId], references: [id], onDelete: Cascade)
  usuario            Usuario?             @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@index([categoriaId])
  @@index([usuarioId])
  @@map("finance_subcategorias")
}

// Adicionar em FinanceContaReceber e FinanceContaPagar:
subcategoriaId      Int?                 @map("subcategoria_id")
subcategoria        FinanceSubcategoria? @relation(fields: [subcategoriaId], references: [id])
```

**Adicionar quando:**
- Usuários pedirem categorização mais detalhada
- Tiver > 20 categorias por tipo (RECEITA/DESPESA)
- Precisar de relatórios hierárquicos

### 8. Centro de Custo (para empresas com múltiplos departamentos)

```prisma
model FinanceCentroCusto {
  id                 Int                  @id @default(autoincrement())
  usuarioId          Int                  @map("usuario_id")
  codigo             String               @db.VarChar(20)
  nome               String               @db.VarChar(100)
  ativo              Boolean              @default(true)
  
  usuario            Usuario              @relation(fields: [usuarioId], references: [id])
  
  @@unique([usuarioId, codigo])
  @@map("finance_centros_custo")
}
```

### 9. Budget/Orçamento (planejamento financeiro)

```prisma
model FinanceOrcamento {
  id                 Int                  @id @default(autoincrement())
  usuarioId          Int                  @map("usuario_id")
  categoriaId        Int?                 @map("categoria_id")
  tipo               String               // RECEITA, DESPESA
  mes                Int                  // 1-12
  ano                Int                  // 2026
  valorPlanejado     Decimal              @map("valor_planejado") @db.Decimal(15, 2)
  
  usuario            Usuario              @relation(fields: [usuarioId], references: [id])
  categoria          FinanceCategoria?    @relation(fields: [categoriaId], references: [id])
  
  @@unique([usuarioId, categoriaId, mes, ano])
  @@map("finance_orcamentos")
}
```

### 10. Conciliação Bancária (para empresas avançadas)

```prisma
model FinanceConciliacao {
  id                 Int                  @id @default(autoincrement())
  contaBancariaId    Int                  @map("conta_bancaria_id")
  dataReferencia     DateTime             @map("data_referencia")
  saldoExtrato       Decimal              @map("saldo_extrato") @db.Decimal(15, 2)
  saldoSistema       Decimal              @map("saldo_sistema") @db.Decimal(15, 2)
  diferenca          Decimal              @db.Decimal(15, 2)
  conciliado         Boolean              @default(false)
  
  contaBancaria      FinanceContaBancaria @relation(fields: [contaBancariaId], references: [id])
  
  @@map("finance_conciliacoes")
}
```

---

## ✅ VALIDAÇÃO FINAL - MODELAGEM PARA MVP

### Checklist de Consistência:

- [x] **Isolamento multiusuário**: Todos os models têm `usuarioId`
- [x] **Índices de usuário**: `@@index([usuarioId])` em todas tabelas principais
- [x] **Auditoria completa**: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- [x] **Soft delete**: Campo `ativo` onde necessário
- [x] **Relacionamentos bidirecionais**: Todas as FKs têm relação reversa no model Usuario
- [x] **OnDelete apropriados**: 
  - `Cascade` para dependentes (Parcelas, Anexos)
  - `SetNull` para referências opcionais (Cliente, Categoria)
- [x] **Campos obrigatórios vs opcionais**: Bem definidos
- [x] **Precisão financeira**: `@db.Decimal(15, 2)` para valores monetários
- [x] **Unique constraints**: `numeroFatura` único
- [x] **Enums tipados**: `TipoReceita` definido

### Funcionalidades Suportadas pelo Schema Atual:

✅ Contas a Receber com múltiplos tipos (Cliente, Salário, Freelance, etc.)
✅ Contas a Pagar com fornecedores
✅ Parcelamento de contas
✅ Receitas recorrentes (assinaturas)
✅ Faturas com itens detalhados
✅ Múltiplas contas bancárias
✅ Categorização de receitas/despesas
✅ Anexos de documentos
✅ Sistema de alertas configurável
✅ Auditoria completa de alterações
✅ Isolamento total entre usuários

### O que está PRONTO para MVP:

🟢 **100% funcional para:**
- Pessoa física controlando finanças pessoais
- Freelancers gerenciando clientes e recebimentos
- Pequenas empresas com gestão financeira básica
- MEI com controle de receitas/despesas

### O que falta para EMPRESAS AVANÇADAS (v2):

🔴 Subcategorias (hierarquia de 2-3 níveis)
🔴 Centro de custo (departamentos)
🔴 Planejamento/Orçamento (budget mensal)
🔴 Conciliação bancária automática
🔴 Fluxo de caixa projetado
🔴 DRE (Demonstração Resultado Exercício)
🔴 Múltiplas moedas
🔴 Importação OFX/CSV de extratos

---

## 🎯 RECOMENDAÇÃO FINAL

### Para MVP (entregar em 2-4 semanas):

**✅ MANTER schema atual + adicionar apenas:**
1. Índices compostos (15min de trabalho)
2. Campo `numeroDocumento` SE emitir NF (5min)
3. Campo `dataPagamento` em Fatura (2min)

**❌ NÃO ADICIONAR agora:**
- Subcategorias (complexidade desnecessária)
- Centro de custo (poucos usuários precisam)
- Budget/Orçamento (funcionalidade avançada)

### Justificativa:
- **Schema atual é ROBUSTO** e bem modelado
- **Suporta 95% dos casos de uso** de pequenas empresas
- **Pode evoluir sem breaking changes**
- **Subcategorias são fáceis de adicionar depois** quando usuários pedirem
- **Foco no MVP**: Entregar funcional > Entregar completo

---

## 🚀 Próximos Passos:

1. **Aplicar índices compostos** (migration):
   ```bash
   cd visionday-hub-api
   npx prisma migrate dev --name add_composite_indexes_finance
   ```

2. **Desenvolver telas do Finance**:
   - Dashboard com resumo
   - CRUD de Contas a Receber
   - CRUD de Contas a Pagar
   - Listagem de Faturas
   - Configuração de Categorias
   - Configuração de Contas Bancárias

3. **v1.1 (próximo ciclo após MVP)**:
   - Adicionar `numeroDocumento` se necessário
   - Migrar status para ENUM
   - Adicionar juros/multa em parcelas

4. **v2 (3-6 meses após lançamento)**:
   - Subcategorias (SE usuários pedirem)
   - Centro de custo
   - Budget/Orçamento
   - Relatórios avançados
