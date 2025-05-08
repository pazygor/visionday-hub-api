-- CreateTable
CREATE TABLE `Monitoramento` (
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
ALTER TABLE `Monitoramento` ADD CONSTRAINT `Monitoramento_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
