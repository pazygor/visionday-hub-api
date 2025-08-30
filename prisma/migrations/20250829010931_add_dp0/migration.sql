-- CreateTable
CREATE TABLE `dp0` (
    `dp0_codope` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `dp0_oper` VARCHAR(191) NOT NULL,
    `dp0_permissao` INTEGER NOT NULL,
    `dp0_grants` VARCHAR(191) NOT NULL,
    `dp0_usergi` VARCHAR(191) NOT NULL,
    `dp0_userga` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`dp0_codope`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dp0` ADD CONSTRAINT `dp0_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dp0` ADD CONSTRAINT `dp0_dp0_permissao_fkey` FOREIGN KEY (`dp0_permissao`) REFERENCES `permissao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
