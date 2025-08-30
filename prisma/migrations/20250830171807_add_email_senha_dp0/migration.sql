/*
  Warnings:

  - Added the required column `dp0_email` to the `dp0` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dp0_senha` to the `dp0` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dp0` ADD COLUMN `dp0_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `dp0_senha` VARCHAR(191) NOT NULL;
