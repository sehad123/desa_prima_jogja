/*
  Warnings:

  - You are about to drop the `pengelola` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pengelola` DROP FOREIGN KEY `Pengelola_desaId_fkey`;

-- DropTable
DROP TABLE `pengelola`;

-- CreateTable
CREATE TABLE `pengurus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desaId` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `nohp` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Pengurus_desaId_fkey`(`desaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pengurus` ADD CONSTRAINT `Pengurus_desaId_fkey` FOREIGN KEY (`desaId`) REFERENCES `desa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
