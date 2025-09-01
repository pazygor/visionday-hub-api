/*
  Warnings:

  - The primary key for the `dp2` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `dp2` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`empresa_id`, `dp2_codtsk`);
