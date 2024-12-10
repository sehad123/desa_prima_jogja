/*
  Warnings:

  - Added the required column `kelurahanNama` to the `Desa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `desa` ADD COLUMN `kabupatenNama` VARCHAR(191) NULL,
    ADD COLUMN `kecamatanNama` VARCHAR(191) NULL,
    ADD COLUMN `kelurahanNama` VARCHAR(191) NOT NULL;
