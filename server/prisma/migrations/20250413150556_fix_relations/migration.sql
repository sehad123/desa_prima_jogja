/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Kabupaten_nama_kabupaten_unique` ON `kabupaten`;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
