/*
  Warnings:

  - You are about to drop the column `aksesKab` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nama_kabupaten]` on the table `kabupaten` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `galeri` DROP FOREIGN KEY `Galeri_desaId_fkey`;

-- DropForeignKey
ALTER TABLE `notulensi` DROP FOREIGN KEY `Notulensi_desaId_fkey`;

-- DropForeignKey
ALTER TABLE `pengurus` DROP FOREIGN KEY `Pengurus_desaId_fkey`;

-- DropForeignKey
ALTER TABLE `produk` DROP FOREIGN KEY `Produk_desaId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `aksesKab`,
    ADD COLUMN `kabupatenId` INTEGER NULL,
    ADD COLUMN `sendEmail` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `nip` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `kabupaten_nama_kabupaten_key` ON `kabupaten`(`nama_kabupaten`);

-- AddForeignKey
ALTER TABLE `galeri` ADD CONSTRAINT `Galeri_desaId_fkey` FOREIGN KEY (`desaId`) REFERENCES `desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notulensi` ADD CONSTRAINT `Notulensi_desaId_fkey` FOREIGN KEY (`desaId`) REFERENCES `desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengurus` ADD CONSTRAINT `Pengurus_desaId_fkey` FOREIGN KEY (`desaId`) REFERENCES `desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produk` ADD CONSTRAINT `Produk_desaId_fkey` FOREIGN KEY (`desaId`) REFERENCES `desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_kabupatenId_fkey` FOREIGN KEY (`kabupatenId`) REFERENCES `kabupaten`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RedefineIndex
-- CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);
DROP INDEX `User_email_key` ON `user`;
