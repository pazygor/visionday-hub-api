-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `account` VARCHAR(191) NULL,
    ADD COLUMN `app_language` VARCHAR(191) NULL,
    ADD COLUMN `auto_project_creation` BOOLEAN NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `email_language` VARCHAR(191) NULL,
    ADD COLUMN `through_put_unit` VARCHAR(191) NULL;
