-- CreateTable
CREATE TABLE `empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cnpj` VARCHAR(14) NOT NULL,
    `razao_social` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(2) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `data_adesao` DATE NOT NULL,
    `hora_adesao` TIME(0) NOT NULL,
    `tenant` VARCHAR(191) NOT NULL,
    `env` VARCHAR(191) NOT NULL,
    `modo_contratado` VARCHAR(20) NOT NULL,
    `limite_projetos` INTEGER NOT NULL DEFAULT 0,
    `limite_servidores` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `empresa_tenant_env_key`(`tenant`, `env`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projeto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `env` VARCHAR(191) NOT NULL,
    `tenant` VARCHAR(191) NOT NULL,
    `data_inicio` DATETIME(3) NOT NULL,
    `usuario_proprietario` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NULL,

    UNIQUE INDEX `projeto_tenant_env_key`(`tenant`, `env`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servidor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `sistema_operacional` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `projeto_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `imagem` VARCHAR(191) NULL,
    `permissao` INTEGER NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `token` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `login_ativo` BOOLEAN NULL,
    `motivo` VARCHAR(191) NULL,
    `validade` DATETIME(3) NULL,
    `perfil` INTEGER NULL,
    `celular` VARCHAR(191) NULL,
    `cadastro` INTEGER NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupo_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `grupo_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupo_alerta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grupo_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerta_parametro_app` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servidorId` INTEGER NOT NULL,
    `cpu` INTEGER NULL,
    `saturation` BOOLEAN NULL,
    `linux_memory` INTEGER NULL,
    `windows_memory` INTEGER NULL,
    `disk_latency` INTEGER NULL,
    `disk_queue` INTEGER NULL,
    `disk_partition` INTEGER NULL,
    `network_packets` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerta_parametro_infra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servidorId` INTEGER NOT NULL,
    `cpu` INTEGER NULL,
    `memoria` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerta_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servidorId` INTEGER NOT NULL,
    `contato` VARCHAR(191) NOT NULL,
    `grupo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servidor` ADD CONSTRAINT `servidor_projeto_id_fkey` FOREIGN KEY (`projeto_id`) REFERENCES `projeto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servidor` ADD CONSTRAINT `servidor_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_empresa_fkey` FOREIGN KEY (`empresa`) REFERENCES `empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grupo_usuario` ADD CONSTRAINT `grupo_usuario_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grupo_usuario` ADD CONSTRAINT `grupo_usuario_grupo_id_fkey` FOREIGN KEY (`grupo_id`) REFERENCES `grupo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grupo_alerta` ADD CONSTRAINT `grupo_alerta_grupo_id_fkey` FOREIGN KEY (`grupo_id`) REFERENCES `grupo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerta_parametro_app` ADD CONSTRAINT `alerta_parametro_app_servidorId_fkey` FOREIGN KEY (`servidorId`) REFERENCES `servidor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerta_parametro_infra` ADD CONSTRAINT `alerta_parametro_infra_servidorId_fkey` FOREIGN KEY (`servidorId`) REFERENCES `servidor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerta_usuario` ADD CONSTRAINT `alerta_usuario_servidorId_fkey` FOREIGN KEY (`servidorId`) REFERENCES `servidor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
