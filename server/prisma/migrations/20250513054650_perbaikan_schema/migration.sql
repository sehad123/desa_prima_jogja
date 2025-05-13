/*
  Warnings:

  - You are about to drop the column `jumlah_anggota_sekarang` on the `kelompokdesa` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah_dana_sekarang` on the `kelompokdesa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `kelompokdesa` DROP COLUMN `jumlah_anggota_sekarang`,
    DROP COLUMN `jumlah_dana_sekarang`;

-- CreateTable
CREATE TABLE `Kas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tgl_transaksi` DATETIME(3) NOT NULL,
    `jenis_transaksi` VARCHAR(191) NOT NULL,
    `nama_transaksi` VARCHAR(191) NOT NULL,
    `total_transaksi` INTEGER NOT NULL,
    `kelompokId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Kas_kelompokId_idx`(`kelompokId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kas` ADD CONSTRAINT `Kas_kelompokId_fkey` FOREIGN KEY (`kelompokId`) REFERENCES `KelompokDesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
