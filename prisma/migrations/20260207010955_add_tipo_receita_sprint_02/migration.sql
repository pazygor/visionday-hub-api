-- AlterTable
ALTER TABLE `finance_contas_receber` ADD COLUMN `dia_vencimento_recorrente` INTEGER NULL,
    ADD COLUMN `tipo` ENUM('CLIENTE', 'SALARIO', 'FREELANCE', 'ALUGUEL', 'VENDA', 'INVESTIMENTO', 'BONIFICACAO', 'OUTRO') NOT NULL DEFAULT 'CLIENTE';

-- CreateIndex
CREATE INDEX `finance_contas_receber_usuario_id_tipo_idx` ON `finance_contas_receber`(`usuario_id`, `tipo`);

-- CreateIndex
CREATE INDEX `finance_contas_receber_usuario_id_status_idx` ON `finance_contas_receber`(`usuario_id`, `status`);
