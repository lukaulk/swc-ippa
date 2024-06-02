-- CreateTable
CREATE TABLE `aluno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(200) NULL,
    `curso_id` INTEGER NULL,
    `telefone` INTEGER NULL,
    `bi` VARCHAR(200) NULL,

    INDEX `curso_id`(`curso_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATE NULL,
    `hora` TIME(0) NULL,
    `local` VARCHAR(200) NULL,
    `tfc_id` INTEGER NULL,
    `usuario_id` INTEGER NULL,

    INDEX `tfc_id`(`tfc_id`),
    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `curso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(200) NULL,
    `descricao` VARCHAR(500) NULL,
    `usuario_id` INTEGER NULL,

    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(200) NULL,
    `descricao` VARCHAR(200) NULL,
    `usuario_id` INTEGER NULL,

    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tfc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(200) NULL,
    `data_entrega` DATE NULL,
    `arquivo` VARCHAR(200) NULL,
    `aluno_id` INTEGER NULL,
    `orientador_id` INTEGER NULL,

    INDEX `aluno_id`(`aluno_id`),
    INDEX `orientador_id`(`orientador_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aluno` ADD CONSTRAINT `aluno_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `curso`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `banca` ADD CONSTRAINT `banca_ibfk_1` FOREIGN KEY (`tfc_id`) REFERENCES `tfc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `banca` ADD CONSTRAINT `banca_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `login`(`id_login`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `curso` ADD CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `login`(`id_login`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `professor` ADD CONSTRAINT `professor_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `login`(`id_login`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tfc` ADD CONSTRAINT `tfc_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `aluno`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tfc` ADD CONSTRAINT `tfc_ibfk_2` FOREIGN KEY (`orientador_id`) REFERENCES `professor`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
