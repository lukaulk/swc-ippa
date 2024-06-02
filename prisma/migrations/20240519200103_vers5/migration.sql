/*
  Warnings:

  - Added the required column `usuario_id` to the `tfc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tfc` ADD COLUMN `usuario_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(200) NOT NULL,
    `senha` VARCHAR(200) NOT NULL,
    `categoria` VARCHAR(200) NOT NULL,
    `usuario_id` INTEGER NOT NULL,

    UNIQUE INDEX `usuario`(`usuario`),
    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `tfc_ibfk_3` ON `tfc`(`usuario_id`);

-- AddForeignKey
ALTER TABLE `tfc` ADD CONSTRAINT `tfc_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `login`(`id_login`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `login`(`id_login`) ON DELETE CASCADE ON UPDATE RESTRICT;
