/*
  Warnings:

  - Made the column `nome` on table `aluno` required. This step will fail if there are existing NULL values in that column.
  - Made the column `curso_id` on table `aluno` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefone` on table `aluno` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bi` on table `aluno` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `aluno` DROP FOREIGN KEY `aluno_ibfk_1`;

-- AlterTable
ALTER TABLE `aluno` MODIFY `nome` VARCHAR(200) NOT NULL,
    MODIFY `curso_id` INTEGER NOT NULL,
    MODIFY `telefone` INTEGER NOT NULL,
    MODIFY `bi` VARCHAR(200) NOT NULL;

-- AddForeignKey
ALTER TABLE `aluno` ADD CONSTRAINT `aluno_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `curso`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
