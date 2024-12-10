-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Desa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_desa` VARCHAR(191) NOT NULL,
    `alamat_desa` VARCHAR(191) NOT NULL,
    `tahun_pembentukan` INTEGER NOT NULL,
    `jumlah_hibah` INTEGER NOT NULL,
    `jumlah_dana_sekarang` INTEGER NOT NULL,
    `jumlah_anggota_awal` INTEGER NOT NULL,
    `jumlah_anggota_sekarang` INTEGER NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
