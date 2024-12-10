/*
  Warnings:

  - You are about to drop the column `alamat_desa` on the `desa` table. All the data in the column will be lost.
  - You are about to drop the column `nama_desa` on the `desa` table. All the data in the column will be lost.
  - Added the required column `kabupaten` to the `Desa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kecamatan` to the `Desa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelompok_desa` to the `Desa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelurahan` to the `Desa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pengurus` to the `Desa` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tahun_pembentukan` on the `desa` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `desa` DROP COLUMN `alamat_desa`,
    DROP COLUMN `nama_desa`,
    ADD COLUMN `kabupaten` VARCHAR(191) NOT NULL,
    ADD COLUMN `kecamatan` VARCHAR(191) NOT NULL,
    ADD COLUMN `kelompok_desa` VARCHAR(191) NOT NULL,
    ADD COLUMN `kelurahan` VARCHAR(191) NOT NULL,
    ADD COLUMN `pengurus` VARCHAR(191) NOT NULL,
    DROP COLUMN `tahun_pembentukan`,
    ADD COLUMN `tahun_pembentukan` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Notulensi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desaId` INTEGER NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `catatan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Galeri` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desaId` INTEGER NOT NULL,
    `gambar` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notulensi` ADD CONSTRAINT `Notulensi_desaId_fkey` FOREIGN KEY (`desaId`) REFERENCES `Desa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Galeri` ADD CONSTRAINT `Galeri_desaId_fkey` FOREIGN KEY (`desaId`) REFERENCES `Desa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
