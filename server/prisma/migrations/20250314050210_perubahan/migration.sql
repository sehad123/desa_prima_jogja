/*
  Warnings:

  - You are about to drop the column `harga` on the `produk` table. All the data in the column will be lost.
  - Added the required column `hargaAkhir` to the `produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hargaAwal` to the `produk` table without a default value. This is not possible if the table is not empty.
  - Made the column `nip` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `produk` DROP COLUMN `harga`,
    ADD COLUMN `hargaAkhir` INTEGER NOT NULL,
    ADD COLUMN `hargaAwal` INTEGER NOT NULL,
    ADD COLUMN `nohp` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `pelakuUsaha` VARCHAR(191) NOT NULL DEFAULT 'Tidak Diketahui';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `aksesKab` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `nip` VARCHAR(191) NOT NULL;
