/*
  Warnings:

  - You are about to drop the `EmpresaProduto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Monitoramento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Produto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `EmpresaProduto` DROP FOREIGN KEY `EmpresaProduto_empresa_id_fkey`;

-- DropForeignKey
ALTER TABLE `EmpresaProduto` DROP FOREIGN KEY `EmpresaProduto_produto_id_fkey`;

-- DropForeignKey
ALTER TABLE `Monitoramento` DROP FOREIGN KEY `Monitoramento_empresa_id_fkey`;

-- DropTable
DROP TABLE `EmpresaProduto`;

-- DropTable
DROP TABLE `Monitoramento`;

-- DropTable
DROP TABLE `Produto`;

-- CreateTable
CREATE TABLE `produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_produto` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ativo',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresa_produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `produto_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ativo',
    `contratado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `empresa_produto_empresa_id_produto_id_key`(`empresa_id`, `produto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monitoramento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `nome_monitoramento` VARCHAR(191) NOT NULL,
    `produto` VARCHAR(191) NOT NULL,
    `projetos` JSON NOT NULL,
    `servidores` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ativo',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `empresa_produto` ADD CONSTRAINT `empresa_produto_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empresa_produto` ADD CONSTRAINT `empresa_produto_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monitoramento` ADD CONSTRAINT `monitoramento_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
