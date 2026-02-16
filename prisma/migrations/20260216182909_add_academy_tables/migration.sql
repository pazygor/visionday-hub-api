-- CreateTable
CREATE TABLE `academy_categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `icone` VARCHAR(50) NULL,
    `cor` VARCHAR(20) NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `academy_categorias_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academy_instrutores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `biografia` TEXT NULL,
    `foto` TEXT NULL,
    `especialidades` TEXT NULL,
    `linkedin` VARCHAR(255) NULL,
    `website` VARCHAR(255) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `academy_instrutores_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academy_cursos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria_id` INTEGER NOT NULL,
    `instrutor_id` INTEGER NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `descricao_completa` TEXT NULL,
    `thumbnail` TEXT NULL,
    `video_intro` TEXT NULL,
    `duracao` INTEGER NULL,
    `nivel` VARCHAR(191) NOT NULL DEFAULT 'INICIANTE',
    `preco` DECIMAL(10, 2) NULL,
    `preco_promocional` DECIMAL(10, 2) NULL,
    `gratuito` BOOLEAN NOT NULL DEFAULT true,
    `certificado` BOOLEAN NOT NULL DEFAULT true,
    `carga_horaria` INTEGER NULL,
    `tags` TEXT NULL,
    `objetivos` TEXT NULL,
    `requisitos` TEXT NULL,
    `oque_learned` TEXT NULL,
    `total_aulas` INTEGER NOT NULL DEFAULT 0,
    `total_alunos` INTEGER NOT NULL DEFAULT 0,
    `avaliacao_media` DECIMAL(3, 2) NULL DEFAULT 0,
    `total_avaliacoes` INTEGER NOT NULL DEFAULT 0,
    `publicado` BOOLEAN NOT NULL DEFAULT false,
    `data_publicacao` DATETIME(3) NULL,
    `destaque` BOOLEAN NOT NULL DEFAULT false,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `academy_cursos_slug_key`(`slug`),
    INDEX `academy_cursos_categoria_id_idx`(`categoria_id`),
    INDEX `academy_cursos_instrutor_id_idx`(`instrutor_id`),
    INDEX `academy_cursos_publicado_idx`(`publicado`),
    INDEX `academy_cursos_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academy_modulos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `curso_id` INTEGER NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `duracao` INTEGER NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `academy_modulos_curso_id_idx`(`curso_id`),
    INDEX `academy_modulos_curso_id_ordem_idx`(`curso_id`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academy_aulas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modulo_id` INTEGER NOT NULL,
    `instrutor_id` INTEGER NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `tipo` VARCHAR(191) NOT NULL DEFAULT 'VIDEO',
    `conteudo_url` TEXT NULL,
    `conteudo_texto` TEXT NULL,
    `duracao` INTEGER NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `gratuita` BOOLEAN NOT NULL DEFAULT false,
    `recursos` TEXT NULL,
    `transcricao` TEXT NULL,
    `thumbnail` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `academy_aulas_modulo_id_idx`(`modulo_id`),
    INDEX `academy_aulas_modulo_id_ordem_idx`(`modulo_id`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academy_matriculas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `curso_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ATIVA',
    `data_matricula` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_inicio` DATETIME(3) NULL,
    `data_conclusao` DATETIME(3) NULL,
    `progresso_geral` INTEGER NOT NULL DEFAULT 0,
    `tempo_assistido` INTEGER NOT NULL DEFAULT 0,
    `ultima_aula_id` INTEGER NULL,
    `favorito` BOOLEAN NOT NULL DEFAULT false,

    INDEX `academy_matriculas_usuario_id_idx`(`usuario_id`),
    INDEX `academy_matriculas_curso_id_idx`(`curso_id`),
    INDEX `academy_matriculas_usuario_id_status_idx`(`usuario_id`, `status`),
    UNIQUE INDEX `academy_matriculas_usuario_id_curso_id_key`(`usuario_id`, `curso_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academy_progressos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula_id` INTEGER NOT NULL,
    `aula_id` INTEGER NOT NULL,
    `concluido` BOOLEAN NOT NULL DEFAULT false,
    `tempo_assistido` INTEGER NOT NULL DEFAULT 0,
    `ultima_posicao` INTEGER NOT NULL DEFAULT 0,
    `data_inicio` DATETIME(3) NULL,
    `data_conclusao` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `academy_progressos_matricula_id_idx`(`matricula_id`),
    INDEX `academy_progressos_aula_id_idx`(`aula_id`),
    UNIQUE INDEX `academy_progressos_matricula_id_aula_id_key`(`matricula_id`, `aula_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academy_certificados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula_id` INTEGER NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `curso_id` INTEGER NOT NULL,
    `data_emissao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `validade_inicio` DATETIME(3) NOT NULL,
    `validade_fim` DATETIME(3) NULL,
    `carga_horaria` INTEGER NOT NULL,
    `nota_final` DECIMAL(5, 2) NULL,
    `hash_validacao` VARCHAR(191) NOT NULL,
    `arquivo_url` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `academy_certificados_matricula_id_key`(`matricula_id`),
    UNIQUE INDEX `academy_certificados_codigo_key`(`codigo`),
    UNIQUE INDEX `academy_certificados_hash_validacao_key`(`hash_validacao`),
    INDEX `academy_certificados_usuario_id_idx`(`usuario_id`),
    INDEX `academy_certificados_curso_id_idx`(`curso_id`),
    INDEX `academy_certificados_codigo_idx`(`codigo`),
    INDEX `academy_certificados_hash_validacao_idx`(`hash_validacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academy_avaliacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `curso_id` INTEGER NOT NULL,
    `nota` INTEGER NOT NULL,
    `comentario` TEXT NULL,
    `aprovado` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `academy_avaliacoes_curso_id_idx`(`curso_id`),
    INDEX `academy_avaliacoes_aprovado_idx`(`aprovado`),
    UNIQUE INDEX `academy_avaliacoes_usuario_id_curso_id_key`(`usuario_id`, `curso_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academy_anotacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `aula_id` INTEGER NOT NULL,
    `conteudo` TEXT NOT NULL,
    `timestamp` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `academy_anotacoes_usuario_id_idx`(`usuario_id`),
    INDEX `academy_anotacoes_aula_id_idx`(`aula_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `academy_cursos` ADD CONSTRAINT `academy_cursos_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `academy_categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_cursos` ADD CONSTRAINT `academy_cursos_instrutor_id_fkey` FOREIGN KEY (`instrutor_id`) REFERENCES `academy_instrutores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_modulos` ADD CONSTRAINT `academy_modulos_curso_id_fkey` FOREIGN KEY (`curso_id`) REFERENCES `academy_cursos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_aulas` ADD CONSTRAINT `academy_aulas_modulo_id_fkey` FOREIGN KEY (`modulo_id`) REFERENCES `academy_modulos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_aulas` ADD CONSTRAINT `academy_aulas_instrutor_id_fkey` FOREIGN KEY (`instrutor_id`) REFERENCES `academy_instrutores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_matriculas` ADD CONSTRAINT `academy_matriculas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_matriculas` ADD CONSTRAINT `academy_matriculas_curso_id_fkey` FOREIGN KEY (`curso_id`) REFERENCES `academy_cursos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_progressos` ADD CONSTRAINT `academy_progressos_matricula_id_fkey` FOREIGN KEY (`matricula_id`) REFERENCES `academy_matriculas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_progressos` ADD CONSTRAINT `academy_progressos_aula_id_fkey` FOREIGN KEY (`aula_id`) REFERENCES `academy_aulas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_certificados` ADD CONSTRAINT `academy_certificados_matricula_id_fkey` FOREIGN KEY (`matricula_id`) REFERENCES `academy_matriculas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_certificados` ADD CONSTRAINT `academy_certificados_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_certificados` ADD CONSTRAINT `academy_certificados_curso_id_fkey` FOREIGN KEY (`curso_id`) REFERENCES `academy_cursos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_avaliacoes` ADD CONSTRAINT `academy_avaliacoes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_avaliacoes` ADD CONSTRAINT `academy_avaliacoes_curso_id_fkey` FOREIGN KEY (`curso_id`) REFERENCES `academy_cursos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academy_anotacoes` ADD CONSTRAINT `academy_anotacoes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
