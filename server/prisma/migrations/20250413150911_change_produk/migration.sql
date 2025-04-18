/*
  Warnings:

  - You are about to drop the column `hargaAkhir` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the column `hargaAwal` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the column `pelakuUsaha` on the `produk` table. All the data in the column will be lost.
  - Added the required column `harga_akhir` to the `Produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `harga_awal` to the `Produk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produk` DROP COLUMN `hargaAkhir`,
    DROP COLUMN `hargaAwal`,
    DROP COLUMN `pelakuUsaha`,
    ADD COLUMN `harga_akhir` INTEGER NOT NULL,
    ADD COLUMN `harga_awal` INTEGER NOT NULL,
    ADD COLUMN `pelaku_usaha` VARCHAR(191) NOT NULL DEFAULT 'Tidak Diketahui';
