/*
  Warnings:

  - Added the required column `periode_akhir` to the `Kabupaten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periode_awal` to the `Kabupaten` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kabupaten` ADD COLUMN `periode_akhir` DATETIME(3) NOT NULL,
    ADD COLUMN `periode_awal` DATETIME(3) NOT NULL;
