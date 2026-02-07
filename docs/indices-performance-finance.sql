-- Migration: Adicionar índices compostos para melhorar performance do Finance MVP
-- Data: 2026-02-07
-- Objetivo: Otimizar queries de dashboard, listagens e relatórios

-- ============================================
-- FINANCE CONTAS A RECEBER
-- ============================================

-- Índice para queries de dashboard filtradas por usuário e vencimento
-- Usado em: Dashboard principal, lista de contas a vencer
CREATE INDEX `finance_contas_receber_usuario_id_data_vencimento_idx` 
ON `finance_contas_receber`(`usuario_id`, `data_vencimento`);

-- Índice para listagens ordenadas por data de criação
-- Usado em: Histórico de contas, últimas movimentações
CREATE INDEX `finance_contas_receber_usuario_id_created_at_idx` 
ON `finance_contas_receber`(`usuario_id`, `created_at`);

-- Índice triplo para dashboard com filtro de status
-- Usado em: Dashboard com filtros (pendentes, pagas, vencidas)
CREATE INDEX `finance_contas_receber_usuario_id_status_data_vencimento_idx` 
ON `finance_contas_receber`(`usuario_id`, `status`, `data_vencimento`);

-- ============================================
-- FINANCE CONTAS A PAGAR
-- ============================================

-- Índice para queries de dashboard filtradas por usuário e vencimento
CREATE INDEX `finance_contas_pagar_usuario_id_data_vencimento_idx` 
ON `finance_contas_pagar`(`usuario_id`, `data_vencimento`);

-- Índice para listagens ordenadas por data de criação
CREATE INDEX `finance_contas_pagar_usuario_id_created_at_idx` 
ON `finance_contas_pagar`(`usuario_id`, `created_at`);

-- Índice triplo para dashboard com filtro de status
CREATE INDEX `finance_contas_pagar_usuario_id_status_data_vencimento_idx` 
ON `finance_contas_pagar`(`usuario_id`, `status`, `data_vencimento`);

-- ============================================
-- FINANCE FATURAS
-- ============================================

-- Índice para listagens de faturas por usuário e data de emissão
CREATE INDEX `finance_faturas_usuario_id_data_emissao_idx` 
ON `finance_faturas`(`usuario_id`, `data_emissao`);

-- Índice para faturas por vencimento (relatórios de recebimentos futuros)
CREATE INDEX `finance_faturas_data_vencimento_idx` 
ON `finance_faturas`(`data_vencimento`);

-- ============================================
-- FINANCE ALERTAS
-- ============================================

-- Índice para alertas não lidos por usuário (notificações)
CREATE INDEX `finance_alertas_usuario_id_lido_created_at_idx` 
ON `finance_alertas`(`usuario_id`, `lido`, `created_at`);

-- ============================================
-- OPCIONAIS (descomentar se necessário)
-- ============================================

-- Campo numeroDocumento para rastreamento de NF/Boletos (se emitir notas fiscais):
-- ALTER TABLE `finance_contas_receber` ADD COLUMN `numero_documento` VARCHAR(50) NULL AFTER `observacoes`;
-- ALTER TABLE `finance_contas_pagar` ADD COLUMN `numero_documento` VARCHAR(50) NULL AFTER `observacoes`;

-- Campo dataPagamento em Faturas:
-- ALTER TABLE `finance_faturas` ADD COLUMN `data_pagamento` DATETIME NULL AFTER `data_vencimento`;

-- Índices para numeroDocumento (se adicionado):
-- CREATE INDEX `finance_contas_receber_numero_documento_idx` ON `finance_contas_receber`(`numero_documento`);
-- CREATE INDEX `finance_contas_pagar_numero_documento_idx` ON `finance_contas_pagar`(`numero_documento`);

-- ============================================
-- VALIDAÇÃO PÓS-MIGRATION
-- ============================================

-- Verificar índices criados:
-- SHOW INDEXES FROM finance_contas_receber WHERE Key_name LIKE '%usuario_id%';
-- SHOW INDEXES FROM finance_contas_pagar WHERE Key_name LIKE '%usuario_id%';
-- SHOW INDEXES FROM finance_faturas WHERE Key_name LIKE '%usuario_id%';

-- Testar performance de query típica de dashboard:
-- EXPLAIN SELECT * FROM finance_contas_receber 
-- WHERE usuario_id = 1 AND status IN ('PENDENTE', 'VENCIDA') 
-- ORDER BY data_vencimento ASC LIMIT 10;

-- Deve usar o índice: finance_contas_receber_usuario_id_status_data_vencimento_idx
