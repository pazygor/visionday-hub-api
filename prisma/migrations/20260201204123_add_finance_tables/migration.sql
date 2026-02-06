-- CreateTable
CREATE TABLE `finance_categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NULL,
    `nome` VARCHAR(100) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `cor` VARCHAR(20) NULL,
    `icone` VARCHAR(50) NULL,
    `descricao` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `finance_categorias_usuario_id_idx`(`usuario_id`),
    INDEX `finance_categorias_tipo_idx`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_formas_pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_contas_bancarias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `banco` VARCHAR(100) NOT NULL,
    `agencia` VARCHAR(20) NOT NULL,
    `conta` VARCHAR(30) NOT NULL,
    `tipo_conta` VARCHAR(191) NOT NULL DEFAULT 'CORRENTE',
    `saldo_inicial` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `saldo_atual` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `chave_pix` VARCHAR(255) NULL,
    `principal` BOOLEAN NOT NULL DEFAULT false,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `finance_contas_bancarias_usuario_id_idx`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `cpf_cnpj` VARCHAR(18) NULL,
    `email` VARCHAR(255) NULL,
    `telefone` VARCHAR(20) NULL,
    `endereco` TEXT NULL,
    `observacoes` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `finance_clientes_usuario_id_idx`(`usuario_id`),
    INDEX `finance_clientes_cpf_cnpj_idx`(`cpf_cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_fornecedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `cpf_cnpj` VARCHAR(18) NULL,
    `email` VARCHAR(255) NULL,
    `telefone` VARCHAR(20) NULL,
    `endereco` TEXT NULL,
    `observacoes` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `finance_fornecedores_usuario_id_idx`(`usuario_id`),
    INDEX `finance_fornecedores_cpf_cnpj_idx`(`cpf_cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_contas_receber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `cliente_id` INTEGER NULL,
    `categoria_id` INTEGER NULL,
    `conta_bancaria_id` INTEGER NULL,
    `forma_pagamento_id` INTEGER NULL,
    `fatura_id` INTEGER NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `valor_total` DECIMAL(15, 2) NOT NULL,
    `valor_pago` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `valor_pendente` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `data_emissao` DATETIME(3) NOT NULL,
    `data_vencimento` DATETIME(3) NOT NULL,
    `data_pagamento` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
    `numero_parcelas` INTEGER NOT NULL DEFAULT 1,
    `observacoes` TEXT NULL,
    `recorrente` BOOLEAN NOT NULL DEFAULT false,
    `frequencia_recorrencia` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    INDEX `finance_contas_receber_usuario_id_idx`(`usuario_id`),
    INDEX `finance_contas_receber_cliente_id_idx`(`cliente_id`),
    INDEX `finance_contas_receber_status_idx`(`status`),
    INDEX `finance_contas_receber_data_vencimento_idx`(`data_vencimento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_contas_pagar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `fornecedor_id` INTEGER NULL,
    `categoria_id` INTEGER NULL,
    `conta_bancaria_id` INTEGER NULL,
    `forma_pagamento_id` INTEGER NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `valor_total` DECIMAL(15, 2) NOT NULL,
    `valor_pago` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `valor_pendente` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `data_emissao` DATETIME(3) NOT NULL,
    `data_vencimento` DATETIME(3) NOT NULL,
    `data_pagamento` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
    `numero_parcelas` INTEGER NOT NULL DEFAULT 1,
    `observacoes` TEXT NULL,
    `recorrente` BOOLEAN NOT NULL DEFAULT false,
    `frequencia_recorrencia` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    INDEX `finance_contas_pagar_usuario_id_idx`(`usuario_id`),
    INDEX `finance_contas_pagar_fornecedor_id_idx`(`fornecedor_id`),
    INDEX `finance_contas_pagar_status_idx`(`status`),
    INDEX `finance_contas_pagar_data_vencimento_idx`(`data_vencimento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_faturas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `cliente_id` INTEGER NULL,
    `forma_pagamento_id` INTEGER NULL,
    `numero_fatura` VARCHAR(191) NOT NULL,
    `valor_total` DECIMAL(15, 2) NOT NULL,
    `desconto` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `acrescimo` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `valor_final` DECIMAL(15, 2) NOT NULL,
    `data_emissao` DATETIME(3) NOT NULL,
    `data_vencimento` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
    `observacoes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,

    UNIQUE INDEX `finance_faturas_numero_fatura_key`(`numero_fatura`),
    INDEX `finance_faturas_usuario_id_idx`(`usuario_id`),
    INDEX `finance_faturas_cliente_id_idx`(`cliente_id`),
    INDEX `finance_faturas_numero_fatura_idx`(`numero_fatura`),
    INDEX `finance_faturas_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_parcelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conta_receber_id` INTEGER NULL,
    `conta_pagar_id` INTEGER NULL,
    `numero_parcela` INTEGER NOT NULL,
    `valor_parcela` DECIMAL(15, 2) NOT NULL,
    `data_vencimento` DATETIME(3) NOT NULL,
    `data_pagamento` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `finance_parcelas_conta_receber_id_idx`(`conta_receber_id`),
    INDEX `finance_parcelas_conta_pagar_id_idx`(`conta_pagar_id`),
    INDEX `finance_parcelas_data_vencimento_idx`(`data_vencimento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_anexos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conta_receber_id` INTEGER NULL,
    `conta_pagar_id` INTEGER NULL,
    `fatura_id` INTEGER NULL,
    `nome_arquivo` VARCHAR(255) NOT NULL,
    `caminho_arquivo` TEXT NOT NULL,
    `tamanho_arquivo` INTEGER NOT NULL,
    `tipo_arquivo` VARCHAR(50) NOT NULL,
    `descricao` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NULL,

    INDEX `finance_anexos_conta_receber_id_idx`(`conta_receber_id`),
    INDEX `finance_anexos_conta_pagar_id_idx`(`conta_pagar_id`),
    INDEX `finance_anexos_fatura_id_idx`(`fatura_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_configuracoes_alertas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `dias_antes_vencimento` INTEGER NOT NULL DEFAULT 3,
    `notificar_contas_vencidas` BOOLEAN NOT NULL DEFAULT true,
    `notificar_pagamentos` BOOLEAN NOT NULL DEFAULT true,
    `email_notificacoes` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `finance_configuracoes_alertas_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_alertas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `nivel` VARCHAR(191) NOT NULL DEFAULT 'INFO',
    `lido` BOOLEAN NOT NULL DEFAULT false,
    `conta_receber_id` INTEGER NULL,
    `conta_pagar_id` INTEGER NULL,
    `data_leitura` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `finance_alertas_usuario_id_idx`(`usuario_id`),
    INDEX `finance_alertas_lido_idx`(`lido`),
    INDEX `finance_alertas_tipo_idx`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `finance_categorias` ADD CONSTRAINT `finance_categorias_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_bancarias` ADD CONSTRAINT `finance_contas_bancarias_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_clientes` ADD CONSTRAINT `finance_clientes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_fornecedores` ADD CONSTRAINT `finance_fornecedores_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_receber` ADD CONSTRAINT `finance_contas_receber_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_receber` ADD CONSTRAINT `finance_contas_receber_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `finance_clientes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_receber` ADD CONSTRAINT `finance_contas_receber_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `finance_categorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_receber` ADD CONSTRAINT `finance_contas_receber_conta_bancaria_id_fkey` FOREIGN KEY (`conta_bancaria_id`) REFERENCES `finance_contas_bancarias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_receber` ADD CONSTRAINT `finance_contas_receber_forma_pagamento_id_fkey` FOREIGN KEY (`forma_pagamento_id`) REFERENCES `finance_formas_pagamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_receber` ADD CONSTRAINT `finance_contas_receber_fatura_id_fkey` FOREIGN KEY (`fatura_id`) REFERENCES `finance_faturas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_receber` ADD CONSTRAINT `finance_contas_receber_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_receber` ADD CONSTRAINT `finance_contas_receber_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_pagar` ADD CONSTRAINT `finance_contas_pagar_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_pagar` ADD CONSTRAINT `finance_contas_pagar_fornecedor_id_fkey` FOREIGN KEY (`fornecedor_id`) REFERENCES `finance_fornecedores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_pagar` ADD CONSTRAINT `finance_contas_pagar_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `finance_categorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_pagar` ADD CONSTRAINT `finance_contas_pagar_conta_bancaria_id_fkey` FOREIGN KEY (`conta_bancaria_id`) REFERENCES `finance_contas_bancarias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_pagar` ADD CONSTRAINT `finance_contas_pagar_forma_pagamento_id_fkey` FOREIGN KEY (`forma_pagamento_id`) REFERENCES `finance_formas_pagamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_pagar` ADD CONSTRAINT `finance_contas_pagar_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_contas_pagar` ADD CONSTRAINT `finance_contas_pagar_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_faturas` ADD CONSTRAINT `finance_faturas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_faturas` ADD CONSTRAINT `finance_faturas_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `finance_clientes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_faturas` ADD CONSTRAINT `finance_faturas_forma_pagamento_id_fkey` FOREIGN KEY (`forma_pagamento_id`) REFERENCES `finance_formas_pagamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_faturas` ADD CONSTRAINT `finance_faturas_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_parcelas` ADD CONSTRAINT `finance_parcelas_conta_receber_id_fkey` FOREIGN KEY (`conta_receber_id`) REFERENCES `finance_contas_receber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_parcelas` ADD CONSTRAINT `finance_parcelas_conta_pagar_id_fkey` FOREIGN KEY (`conta_pagar_id`) REFERENCES `finance_contas_pagar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_anexos` ADD CONSTRAINT `finance_anexos_conta_receber_id_fkey` FOREIGN KEY (`conta_receber_id`) REFERENCES `finance_contas_receber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_anexos` ADD CONSTRAINT `finance_anexos_conta_pagar_id_fkey` FOREIGN KEY (`conta_pagar_id`) REFERENCES `finance_contas_pagar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_anexos` ADD CONSTRAINT `finance_anexos_fatura_id_fkey` FOREIGN KEY (`fatura_id`) REFERENCES `finance_faturas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_anexos` ADD CONSTRAINT `finance_anexos_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_configuracoes_alertas` ADD CONSTRAINT `finance_configuracoes_alertas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `finance_alertas` ADD CONSTRAINT `finance_alertas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
