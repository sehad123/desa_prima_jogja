/*
  Warnings:

  - You are about to drop the column `jumlah_hibah` on the `desa` table. All the data in the column will be lost.
  - Added the required column `jumlah_hibah_diterima` to the `Desa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `desa` DROP COLUMN `jumlah_hibah`,
    ADD COLUMN `jumlah_hibah_diterima` INTEGER NOT NULL;
