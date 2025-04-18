/*
  Warnings:

  - You are about to drop the column `periode_akhir` on the `kabupaten` table. All the data in the column will be lost.
  - You are about to drop the column `periode_awal` on the `kabupaten` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `kabupaten` DROP COLUMN `periode_akhir`,
    DROP COLUMN `periode_awal`;
