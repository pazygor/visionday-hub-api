/*
  Warnings:

  - You are about to drop the column `categoria_id` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `destaque` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `disponivel` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `empresa_id` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `imagem` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `preco` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `vendido_por_kg` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `empresa_id` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `adicional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `empresa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `endereco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grupo_adicional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historico_pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `item_adicional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `item_pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produto_grupo_adicional` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sistema_id` to the `produto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `adicional` DROP FOREIGN KEY `adicional_grupo_adicional_id_fkey`;

-- DropForeignKey
ALTER TABLE `categoria` DROP FOREIGN KEY `categoria_empresa_id_fkey`;

-- DropForeignKey
ALTER TABLE `endereco` DROP FOREIGN KEY `endereco_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `grupo_adicional` DROP FOREIGN KEY `grupo_adicional_empresa_id_fkey`;

-- DropForeignKey
ALTER TABLE `historico_pedido` DROP FOREIGN KEY `historico_pedido_pedido_id_fkey`;

-- DropForeignKey
ALTER TABLE `item_adicional` DROP FOREIGN KEY `item_adicional_adicional_id_fkey`;

-- DropForeignKey
ALTER TABLE `item_adicional` DROP FOREIGN KEY `item_adicional_item_pedido_id_fkey`;

-- DropForeignKey
ALTER TABLE `item_pedido` DROP FOREIGN KEY `item_pedido_pedido_id_fkey`;

-- DropForeignKey
ALTER TABLE `item_pedido` DROP FOREIGN KEY `item_pedido_produto_id_fkey`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `pedido_empresa_id_fkey`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `pedido_endereco_id_fkey`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `pedido_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `produto_categoria_id_fkey`;

-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `produto_empresa_id_fkey`;

-- DropForeignKey
ALTER TABLE `produto_grupo_adicional` DROP FOREIGN KEY `produto_grupo_adicional_grupo_adicional_id_fkey`;

-- DropForeignKey
ALTER TABLE `produto_grupo_adicional` DROP FOREIGN KEY `produto_grupo_adicional_produto_id_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_empresa_id_fkey`;

-- DropIndex
DROP INDEX `produto_categoria_id_fkey` ON `produto`;

-- DropIndex
DROP INDEX `produto_empresa_id_fkey` ON `produto`;

-- DropIndex
DROP INDEX `usuario_empresa_id_fkey` ON `usuario`;

-- AlterTable
ALTER TABLE `permissao` ADD COLUMN `nivel` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `produto` DROP COLUMN `categoria_id`,
    DROP COLUMN `destaque`,
    DROP COLUMN `disponivel`,
    DROP COLUMN `empresa_id`,
    DROP COLUMN `imagem`,
    DROP COLUMN `preco`,
    DROP COLUMN `vendido_por_kg`,
    ADD COLUMN `ativo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `sistema_id` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'ativo';

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `empresa_id`;

-- DropTable
DROP TABLE `adicional`;

-- DropTable
DROP TABLE `categoria`;

-- DropTable
DROP TABLE `empresa`;

-- DropTable
DROP TABLE `endereco`;

-- DropTable
DROP TABLE `grupo_adicional`;

-- DropTable
DROP TABLE `historico_pedido`;

-- DropTable
DROP TABLE `item_adicional`;

-- DropTable
DROP TABLE `item_pedido`;

-- DropTable
DROP TABLE `pedido`;

-- DropTable
DROP TABLE `produto_grupo_adicional`;

-- CreateTable
CREATE TABLE `produto_sistema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `icone` VARCHAR(191) NULL,
    `cor` VARCHAR(191) NULL,
    `path` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `produto_sistema_codigo_key`(`codigo`),
    UNIQUE INDEX `produto_sistema_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_produto_sistema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `produto_sistema_id` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `data_acesso` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuario_produto_sistema_usuario_id_produto_sistema_id_key`(`usuario_id`, `produto_sistema_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `produto_id` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuario_produto_usuario_id_produto_id_key`(`usuario_id`, `produto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `cnpj_cpf` VARCHAR(18) NOT NULL,
    `cnpj_cpf_numerico` VARCHAR(14) NOT NULL,
    `tipo_documento` VARCHAR(4) NOT NULL,
    `razao_social` VARCHAR(255) NOT NULL,
    `nome_fantasia` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `telefone` VARCHAR(20) NULL,
    `cidade` VARCHAR(100) NULL,
    `estado` CHAR(2) NULL,
    `endereco_completo` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ATIVO',
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_atualizacao` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    UNIQUE INDEX `clientes_codigo_key`(`codigo`),
    UNIQUE INDEX `clientes_cnpj_cpf_key`(`cnpj_cpf`),
    UNIQUE INDEX `clientes_cnpj_cpf_numerico_key`(`cnpj_cpf_numerico`),
    INDEX `clientes_cnpj_cpf_numerico_idx`(`cnpj_cpf_numerico`),
    INDEX `clientes_codigo_idx`(`codigo`),
    INDEX `clientes_status_idx`(`status`),
    INDEX `clientes_razao_social_idx`(`razao_social`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes_contatos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL DEFAULT 'PRINCIPAL',
    `nome` VARCHAR(255) NULL,
    `ddd` VARCHAR(3) NULL,
    `telefone` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `recebe_notificacoes` BOOLEAN NOT NULL DEFAULT false,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_atualizacao` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,

    INDEX `clientes_contatos_cliente_id_idx`(`cliente_id`),
    INDEX `clientes_contatos_tipo_idx`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes_dados_bancarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `banco` VARCHAR(100) NOT NULL,
    `agencia` VARCHAR(20) NOT NULL,
    `conta` VARCHAR(30) NOT NULL,
    `tipo_conta` VARCHAR(191) NOT NULL DEFAULT 'CORRENTE',
    `titular` VARCHAR(255) NULL,
    `cnpj_cpf_titular` VARCHAR(18) NULL,
    `principal` BOOLEAN NOT NULL DEFAULT false,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_atualizacao` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,

    INDEX `clientes_dados_bancarios_cliente_id_idx`(`cliente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `produto_sistema_id_fkey` FOREIGN KEY (`sistema_id`) REFERENCES `produto_sistema`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_produto_sistema` ADD CONSTRAINT `usuario_produto_sistema_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_produto_sistema` ADD CONSTRAINT `usuario_produto_sistema_produto_sistema_id_fkey` FOREIGN KEY (`produto_sistema_id`) REFERENCES `produto_sistema`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_produto` ADD CONSTRAINT `usuario_produto_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_produto` ADD CONSTRAINT `usuario_produto_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientes_contatos` ADD CONSTRAINT `clientes_contatos_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientes_contatos` ADD CONSTRAINT `clientes_contatos_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientes_dados_bancarios` ADD CONSTRAINT `clientes_dados_bancarios_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientes_dados_bancarios` ADD CONSTRAINT `clientes_dados_bancarios_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
