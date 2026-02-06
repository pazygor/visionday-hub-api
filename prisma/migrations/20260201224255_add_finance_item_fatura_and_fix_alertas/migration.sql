/*
  Warnings:

  - You are about to drop the column `nivel` on the `finance_alertas` table. All the data in the column will be lost.
  - You are about to drop the column `dias_antes_vencimento` on the `finance_configuracoes_alertas` table. All the data in the column will be lost.
  - You are about to drop the column `email_notificacoes` on the `finance_configuracoes_alertas` table. All the data in the column will be lost.
  - You are about to drop the column `notificar_contas_vencidas` on the `finance_configuracoes_alertas` table. All the data in the column will be lost.
  - You are about to drop the column `notificar_pagamentos` on the `finance_configuracoes_alertas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `finance_alertas` DROP COLUMN `nivel`,
    ADD COLUMN `severidade` VARCHAR(191) NOT NULL DEFAULT 'INFO';

-- AlterTable
ALTER TABLE `finance_configuracoes_alertas` DROP COLUMN `dias_antes_vencimento`,
    DROP COLUMN `email_notificacoes`,
    DROP COLUMN `notificar_contas_vencidas`,
    DROP COLUMN `notificar_pagamentos`,
    ADD COLUMN `contas_vencer_ativo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `contas_vencer_dias` INTEGER NOT NULL DEFAULT 3,
    ADD COLUMN `contas_vencidas_ativo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `email_notificacao` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `limite_conta_bancaria_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `limite_conta_bancaria_valor` DECIMAL(15, 2) NULL,
    ADD COLUMN `notificacao_sistema` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `finance_itens_fatura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fatura_id` INTEGER NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `valor_unitario` DECIMAL(15, 2) NOT NULL,
    `valor_total` DECIMAL(15, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `finance_itens_fatura_fatura_id_idx`(`fatura_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `finance_itens_fatura` ADD CONSTRAINT `finance_itens_fatura_fatura_id_fkey` FOREIGN KEY (`fatura_id`) REFERENCES `finance_faturas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
