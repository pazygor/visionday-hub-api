-- AlterTable
ALTER TABLE `dp0` ADD COLUMN `usuario_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `dp0` ADD CONSTRAINT `dp0_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
