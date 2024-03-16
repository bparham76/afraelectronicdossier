/*
  Warnings:

  - You are about to drop the `drugrecord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `drugType` to the `Dossier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `AccessToken_userId_fkey` ON `accesstoken`;

-- DropIndex
DROP INDEX `Dossier_patientId_fkey` ON `dossier`;

-- AlterTable
ALTER TABLE `dossier` ADD COLUMN `drugType` ENUM('B2', 'Opium', 'Metadon') NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('Doctor', 'Secretary', 'Admin', 'SuperAdmin') NOT NULL;

-- DropTable
DROP TABLE `drugrecord`;

-- CreateTable
CREATE TABLE `Reception` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dossierId` INTEGER NULL,
    `drugDose` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccessToken` ADD CONSTRAINT `AccessToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossier` ADD CONSTRAINT `Dossier_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception` ADD CONSTRAINT `Reception_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
