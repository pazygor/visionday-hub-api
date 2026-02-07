-- AlterTable
ALTER TABLE `finance_contas_pagar` ADD COLUMN `integracao_id` VARCHAR(100) NULL,
    ADD COLUMN `integracao_tipo` VARCHAR(50) NULL,
    ADD COLUMN `metadados` JSON NULL,
    ADD COLUMN `numero_documento` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `finance_contas_receber` ADD COLUMN `integracao_id` VARCHAR(100) NULL,
    ADD COLUMN `integracao_tipo` VARCHAR(50) NULL,
    ADD COLUMN `metadados` JSON NULL,
    ADD COLUMN `numero_documento` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `finance_faturas` ADD COLUMN `data_pagamento` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `finance_parcelas` ADD COLUMN `desconto` DECIMAL(15, 2) NULL DEFAULT 0,
    ADD COLUMN `juros` DECIMAL(15, 2) NULL DEFAULT 0,
    ADD COLUMN `multa` DECIMAL(15, 2) NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `finance_alertas_usuario_id_lido_created_at_idx` ON `finance_alertas`(`usuario_id`, `lido`, `created_at`);

-- CreateIndex
CREATE INDEX `finance_contas_pagar_usuario_id_data_vencimento_idx` ON `finance_contas_pagar`(`usuario_id`, `data_vencimento`);

-- CreateIndex
CREATE INDEX `finance_contas_pagar_usuario_id_created_at_idx` ON `finance_contas_pagar`(`usuario_id`, `created_at`);

-- CreateIndex
CREATE INDEX `finance_contas_pagar_usuario_id_status_data_vencimento_idx` ON `finance_contas_pagar`(`usuario_id`, `status`, `data_vencimento`);

-- CreateIndex
CREATE INDEX `finance_contas_receber_usuario_id_data_vencimento_idx` ON `finance_contas_receber`(`usuario_id`, `data_vencimento`);

-- CreateIndex
CREATE INDEX `finance_contas_receber_usuario_id_created_at_idx` ON `finance_contas_receber`(`usuario_id`, `created_at`);

-- CreateIndex
CREATE INDEX `finance_contas_receber_usuario_id_status_data_vencimento_idx` ON `finance_contas_receber`(`usuario_id`, `status`, `data_vencimento`);

-- CreateIndex
CREATE INDEX `finance_faturas_usuario_id_data_emissao_idx` ON `finance_faturas`(`usuario_id`, `data_emissao`);

-- CreateIndex
CREATE INDEX `finance_faturas_data_vencimento_idx` ON `finance_faturas`(`data_vencimento`);
