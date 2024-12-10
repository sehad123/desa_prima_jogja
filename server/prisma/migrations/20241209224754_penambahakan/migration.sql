-- CreateTable
CREATE TABLE `kabupaten` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kabupaten` VARCHAR(191) NOT NULL,
    `jumlah_desa` INTEGER NOT NULL,
    `periode_awal` DATETIME(3) NOT NULL,
    `periode_akhir` DATETIME(3) NOT NULL,
    `ketua_forum` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
