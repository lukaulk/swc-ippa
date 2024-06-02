/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `login` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoria` to the `login` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `login` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Login_usuario_key` ON `login`;

-- AlterTable
ALTER TABLE `login` ADD COLUMN `categoria` VARCHAR(200) NOT NULL,
    ADD COLUMN `email` VARCHAR(200) NOT NULL,
    MODIFY `usuario` VARCHAR(200) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `login_email_key` ON `login`(`email`);
