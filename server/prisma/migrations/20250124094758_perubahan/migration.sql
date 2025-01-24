/*
  Warnings:

  - You are about to drop the column `pengurus` on the `desa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `desa` DROP COLUMN `pengurus`,
    ADD COLUMN `catatan` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NULL;
