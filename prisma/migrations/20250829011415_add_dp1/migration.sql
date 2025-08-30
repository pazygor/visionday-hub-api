-- CreateTable
CREATE TABLE `dp1` (
    `dp1_codope` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `dp1_oper` VARCHAR(191) NOT NULL,
    `dp1_usergi` VARCHAR(191) NOT NULL,
    `dp1_userga` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`dp1_codope`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dp1` ADD CONSTRAINT `dp1_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
