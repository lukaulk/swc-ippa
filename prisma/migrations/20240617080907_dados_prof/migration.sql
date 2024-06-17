/*
  Warnings:

  - Added the required column `banca` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordenador` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orientador` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Made the column `nome` on table `professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descricao` on table `professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuario_id` on table `professor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `professor` DROP FOREIGN KEY `professor_ibfk_1`;

-- AlterTable
ALTER TABLE `nota` MODIFY `valor` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `professor` ADD COLUMN `banca` BOOLEAN NOT NULL,
    ADD COLUMN `coordenador` BOOLEAN NOT NULL,
    ADD COLUMN `orientador` BOOLEAN NOT NULL,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL,
    MODIFY `nome` VARCHAR(191) NOT NULL,
    MODIFY `descricao` VARCHAR(191) NOT NULL,
    MODIFY `usuario_id` INTEGER NOT NULL;
