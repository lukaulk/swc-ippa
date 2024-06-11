/*
  Warnings:

  - You are about to drop the column `hora` on the `banca` table. All the data in the column will be lost.
  - Added the required column `presidente` to the `banca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vogal1` to the `banca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vogal2` to the `banca` table without a default value. This is not possible if the table is not empty.
  - Made the column `tfc_id` on table `banca` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuario_id` on table `banca` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `observacoes` to the `tfc` table without a default value. This is not possible if the table is not empty.
  - Made the column `aluno_id` on table `tfc` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orientador_id` on table `tfc` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `banca` DROP FOREIGN KEY `banca_ibfk_1`;

-- DropForeignKey
ALTER TABLE `banca` DROP FOREIGN KEY `banca_ibfk_2`;

-- DropForeignKey
ALTER TABLE `tfc` DROP FOREIGN KEY `tfc_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tfc` DROP FOREIGN KEY `tfc_ibfk_2`;

-- AlterTable
ALTER TABLE `banca` DROP COLUMN `hora`,
    ADD COLUMN `hora_fim` VARCHAR(10) NULL,
    ADD COLUMN `hora_inicio` VARCHAR(10) NULL,
    ADD COLUMN `presidente` INTEGER NOT NULL,
    ADD COLUMN `vogal1` INTEGER NOT NULL,
    ADD COLUMN `vogal2` INTEGER NOT NULL,
    MODIFY `tfc_id` INTEGER NOT NULL,
    MODIFY `usuario_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tfc` ADD COLUMN `observacoes` VARCHAR(200) NOT NULL,
    MODIFY `aluno_id` VARCHAR(300) NOT NULL,
    MODIFY `orientador_id` VARCHAR(300) NOT NULL;

-- CreateTable
CREATE TABLE `commits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mensagem` VARCHAR(200) NOT NULL,
    `timestamp` VARCHAR(10) NOT NULL,
    `aluno_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estadoTFC` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accao` VARCHAR(191) NOT NULL,
    `finalizado` BOOLEAN NOT NULL DEFAULT false,
    `aprovado` BOOLEAN NOT NULL DEFAULT false,
    `commits_id` INTEGER NOT NULL,
    `tfc_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tfc_id` INTEGER NOT NULL,
    `banca_id` INTEGER NOT NULL,
    `valor` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `banca_ibfk_3` ON `banca`(`presidente`);

-- CreateIndex
CREATE INDEX `banca_ibfk_4` ON `banca`(`vogal1`);

-- CreateIndex
CREATE INDEX `banca_ibfk_5` ON `banca`(`vogal2`);

-- AddForeignKey
ALTER TABLE `commits` ADD CONSTRAINT `commits_aluno_id_fkey` FOREIGN KEY (`aluno_id`) REFERENCES `aluno`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `estadoTFC` ADD CONSTRAINT `estadoTFC_commits_id_fkey` FOREIGN KEY (`commits_id`) REFERENCES `commits`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `estadoTFC` ADD CONSTRAINT `estado_tfc_ibfk_1` FOREIGN KEY (`tfc_id`) REFERENCES `tfc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `nota` ADD CONSTRAINT `nota_tfc_id_fkey` FOREIGN KEY (`tfc_id`) REFERENCES `tfc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `nota` ADD CONSTRAINT `nota_banca_id_fkey` FOREIGN KEY (`banca_id`) REFERENCES `banca`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
