/*
  Warnings:

  - You are about to drop the column `desaId` on the `galeri` table. All the data in the column will be lost.
  - You are about to drop the column `desaId` on the `notulensi` table. All the data in the column will be lost.
  - You are about to drop the column `desaId` on the `pengurus` table. All the data in the column will be lost.
  - You are about to drop the column `desaId` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the `desa` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `kelompokId` to the `Galeri` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelompokId` to the `Notulensi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelompokId` to the `Pengurus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelompokId` to the `Produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Produk` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `galeri` DROP FOREIGN KEY `Galeri_desaId_fkey`;

-- DropForeignKey
ALTER TABLE `notulensi` DROP FOREIGN KEY `Notulensi_desaId_fkey`;

-- DropForeignKey
ALTER TABLE `pengurus` DROP FOREIGN KEY `Pengurus_desaId_fkey`;

-- DropForeignKey
ALTER TABLE `produk` DROP FOREIGN KEY `Produk_desaId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_kabupatenId_fkey`;

-- AlterTable
ALTER TABLE `galeri` DROP COLUMN `desaId`,
    ADD COLUMN `kelompokId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `notulensi` DROP COLUMN `desaId`,
    ADD COLUMN `kelompokId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pengurus` DROP COLUMN `desaId`,
    ADD COLUMN `kelompokId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `produk` DROP COLUMN `desaId`,
    ADD COLUMN `kelompokId` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `desa`;

-- CreateTable
CREATE TABLE `KelompokDesa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `kabupaten_kota` VARCHAR(191) NOT NULL,
    `kecamatan` VARCHAR(191) NOT NULL,
    `kelurahan` VARCHAR(191) NOT NULL,
    `tanggal_pembentukan` DATETIME(3) NOT NULL,
    `jumlah_dana_sekarang` INTEGER NOT NULL,
    `jumlah_anggota_awal` INTEGER NOT NULL,
    `jumlah_anggota_sekarang` INTEGER NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `jumlah_hibah_diterima` INTEGER NOT NULL,
    `status` VARCHAR(191) NULL,
    `catatan` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `kabupatenId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `KelompokDesa_kabupatenId_idx`(`kabupatenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Galeri_kelompokId_idx` ON `Galeri`(`kelompokId`);

-- CreateIndex
CREATE INDEX `Notulensi_kelompokId_idx` ON `Notulensi`(`kelompokId`);

-- CreateIndex
CREATE INDEX `Pengurus_kelompokId_idx` ON `Pengurus`(`kelompokId`);

-- CreateIndex
CREATE INDEX `Produk_kelompokId_idx` ON `Produk`(`kelompokId`);

-- AddForeignKey
ALTER TABLE `KelompokDesa` ADD CONSTRAINT `KelompokDesa_kabupatenId_fkey` FOREIGN KEY (`kabupatenId`) REFERENCES `Kabupaten`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Galeri` ADD CONSTRAINT `Galeri_kelompokId_fkey` FOREIGN KEY (`kelompokId`) REFERENCES `KelompokDesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notulensi` ADD CONSTRAINT `Notulensi_kelompokId_fkey` FOREIGN KEY (`kelompokId`) REFERENCES `KelompokDesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengurus` ADD CONSTRAINT `Pengurus_kelompokId_fkey` FOREIGN KEY (`kelompokId`) REFERENCES `KelompokDesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produk` ADD CONSTRAINT `Produk_kelompokId_fkey` FOREIGN KEY (`kelompokId`) REFERENCES `KelompokDesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_kabupatenId_fkey` FOREIGN KEY (`kabupatenId`) REFERENCES `Kabupaten`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `Kabupaten_nama_kabupaten_unique` ON `Kabupaten`(`nama_kabupaten`);
DROP INDEX `kabupaten_nama_kabupaten_key` ON `kabupaten`;

-- RedefineIndex
DROP INDEX `User_email_key` ON `User`;
ALTER TABLE `User` ADD UNIQUE `User_email_key` (`email`);
DROP INDEX `user_email_key` ON `user`;
