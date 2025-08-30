-- CreateTable
CREATE TABLE `dp2` (
    `dp2_codtsk` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `dp2_task` VARCHAR(191) NOT NULL,
    `dp2_tag` VARCHAR(191) NULL,
    `dp2_usergi` VARCHAR(191) NULL,
    `dp2_userga` VARCHAR(191) NULL,

    PRIMARY KEY (`dp2_codtsk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dp3` (
    `dp3_codent` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `dp3_nome` VARCHAR(191) NOT NULL,
    `dp3_ipsvs` VARCHAR(191) NULL,
    `dp3_porta` VARCHAR(191) NULL,
    `dp3_usergi` VARCHAR(191) NULL,
    `dp3_userga` VARCHAR(191) NULL,

    PRIMARY KEY (`dp3_codent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dp2` ADD CONSTRAINT `dp2_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dp3` ADD CONSTRAINT `dp3_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
