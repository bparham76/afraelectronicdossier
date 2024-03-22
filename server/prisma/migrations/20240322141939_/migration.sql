/*
  Warnings:

  - You are about to drop the column `address` on the `dossier` table. All the data in the column will be lost.
  - You are about to drop the column `landLine` on the `dossier` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `dossier` table. All the data in the column will be lost.
  - You are about to drop the column `activeState` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `appStartDateTime` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `baseDateTime` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `quantiry` on the `storage` table. All the data in the column will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `state` to the `Dossier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landLine` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Storage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `AccessToken_userId_fkey` ON `accesstoken`;

-- DropIndex
DROP INDEX `Dossier_patientId_fkey` ON `dossier`;

-- DropIndex
DROP INDEX `Reception_dossierId_fkey` ON `reception`;

-- AlterTable
ALTER TABLE `dossier` DROP COLUMN `address`,
    DROP COLUMN `landLine`,
    DROP COLUMN `phone`,
    ADD COLUMN `state` ENUM('Active', 'Suspended') NOT NULL;

-- AlterTable
ALTER TABLE `patient` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `landLine` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `settings` DROP COLUMN `activeState`,
    DROP COLUMN `appStartDateTime`,
    DROP COLUMN `baseDateTime`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `value` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `storage` DROP COLUMN `quantiry`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- DropTable
DROP TABLE `transaction`;

-- CreateTable
CREATE TABLE `StorageTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `drug` ENUM('B2', 'Opium', 'Metadon') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `prevAmount` INTEGER NOT NULL,
    `currAmount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccessToken` ADD CONSTRAINT `AccessToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossier` ADD CONSTRAINT `Dossier_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception` ADD CONSTRAINT `Reception_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
