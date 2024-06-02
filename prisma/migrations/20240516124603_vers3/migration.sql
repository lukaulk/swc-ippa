/*
  Warnings:

  - Added the required column `usuario_id` to the `aluno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `usuario_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `aluno_ibfk_2` ON `aluno`(`usuario_id`);

-- AddForeignKey
ALTER TABLE `aluno` ADD CONSTRAINT `aluno_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `login`(`id_login`) ON DELETE CASCADE ON UPDATE RESTRICT;
