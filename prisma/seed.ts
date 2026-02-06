import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (em ordem de dependência)
  await prisma.financeAlerta.deleteMany();
  await prisma.financeConfiguracaoAlerta.deleteMany();
  await prisma.financeAnexo.deleteMany();
  await prisma.financeParcela.deleteMany();
  await prisma.financeContaReceber.deleteMany();
  await prisma.financeContaPagar.deleteMany();
  await prisma.financeFatura.deleteMany();
  await prisma.financeCliente.deleteMany();
  await prisma.financeFornecedor.deleteMany();
  await prisma.financeContaBancaria.deleteMany();
  await prisma.financeCategoria.deleteMany();
  await prisma.financeFormaPagamento.deleteMany();
  await prisma.usuarioProduto.deleteMany();
  await prisma.usuarioProdutoSistema.deleteMany();
  await prisma.clienteDadosBancarios.deleteMany();
  await prisma.clienteContato.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.produtoSistema.deleteMany();
  await prisma.permissao.deleteMany();

  console.log('✅ Dados antigos removidos');

  // ============================================
  // 1. CRIAR PERMISSÕES
  // ============================================
  console.log('\n📋 Criando permissões...');
  
  const permissaoAdmin = await prisma.permissao.create({
    data: {
      nome: 'admin',
      descricao: 'Administrador do sistema com acesso total',
      nivel: 100,
    },
  });

  const permissaoUser = await prisma.permissao.create({
    data: {
      nome: 'user',
      descricao: 'Usuário padrão com acesso limitado',
      nivel: 50,
    },
  });

  const permissaoViewer = await prisma.permissao.create({
    data: {
      nome: 'viewer',
      descricao: 'Visualizador - apenas leitura',
      nivel: 10,
    },
  });

  console.log(`   ✅ ${await prisma.permissao.count()} permissões criadas`);

  // ============================================
  // 2. CRIAR SISTEMAS (ProdutoSistema)
  // ============================================
  console.log('\n🎯 Criando sistemas...');
  
  const sistemaDigital = await prisma.produtoSistema.create({
    data: {
      codigo: 'digital',
      nome: 'VisionDay Digital',
      descricao: 'Plataforma de Contabilidade Digital completa para gestão fiscal e contábil',
      icone: 'Building2',
      cor: 'from-blue-500 to-blue-600',
      path: '/digital/dashboard',
      ativo: true,
      ordem: 1,
    },
  });

  const sistemaFinance = await prisma.produtoSistema.create({
    data: {
      codigo: 'finance',
      nome: 'VisionDay Finance',
      descricao: 'Plataforma Financeira para controle e gestão das suas finanças',
      icone: 'DollarSign',
      cor: 'from-green-500 to-green-600',
      path: '/finance/dashboard',
      ativo: true,
      ordem: 2,
    },
  });

  const sistemaAcademy = await prisma.produtoSistema.create({
    data: {
      codigo: 'academy',
      nome: 'VisionDay Academy',
      descricao: 'Plataforma de Cursos e Capacitação profissional',
      icone: 'GraduationCap',
      cor: 'from-purple-500 to-purple-600',
      path: '/academy/dashboard',
      ativo: true,
      ordem: 3,
    },
  });

  console.log(`   ✅ ${await prisma.produtoSistema.count()} sistemas criados`);

  // ============================================
  // 3. CRIAR PRODUTOS (Módulos dentro dos sistemas)
  // ============================================
  console.log('\n📦 Criando produtos/módulos...');
  
  // Produtos do Digital
  await prisma.produto.createMany({
    data: [
      {
        sistemaId: sistemaDigital.id,
        nome: 'Módulo Fiscal',
        descricao: 'Gestão de obrigações fiscais e tributárias',
        status: 'ativo',
        ordem: 1,
      },
      {
        sistemaId: sistemaDigital.id,
        nome: 'Módulo Contábil',
        descricao: 'Lançamentos e balancetes contábeis',
        status: 'ativo',
        ordem: 2,
      },
      {
        sistemaId: sistemaDigital.id,
        nome: 'Gestão de Clientes',
        descricao: 'Cadastro e gestão de clientes',
        status: 'ativo',
        ordem: 3,
      },
    ],
  });

  // Produtos do Finance
  await prisma.produto.createMany({
    data: [
      {
        sistemaId: sistemaFinance.id,
        nome: 'Gestão de Transações',
        descricao: 'Controle de receitas e despesas',
        status: 'ativo',
        ordem: 1,
      },
      {
        sistemaId: sistemaFinance.id,
        nome: 'Faturamento',
        descricao: 'Emissão e controle de faturas',
        status: 'ativo',
        ordem: 2,
      },
      {
        sistemaId: sistemaFinance.id,
        nome: 'Relatórios Financeiros',
        descricao: 'Dashboards e relatórios financeiros',
        status: 'ativo',
        ordem: 3,
      },
    ],
  });

  // Produtos do Academy
  await prisma.produto.createMany({
    data: [
      {
        sistemaId: sistemaAcademy.id,
        nome: 'Cursos',
        descricao: 'Gestão de cursos e trilhas',
        status: 'ativo',
        ordem: 1,
      },
      {
        sistemaId: sistemaAcademy.id,
        nome: 'Certificados',
        descricao: 'Emissão de certificados',
        status: 'ativo',
        ordem: 2,
      },
    ],
  });

  console.log(`   ✅ ${await prisma.produto.count()} produtos criados`);

  // ============================================
  // 4. CRIAR USUÁRIOS
  // ============================================
  console.log('\n👤 Criando usuários...');
  
  const senhaHash = await bcrypt.hash('Pazygor080@', 10);

  // Usuário Admin com acesso a todos os sistemas
  const userAdmin = await prisma.usuario.create({
    data: {
      nome: 'Dayane Paz',
      email: 'dayane_paz@gmail.com',
      senha: senhaHash,
      telefone: '11987654321',
      cpf: '12345678901',
      permissaoId: permissaoAdmin.id,
      ativo: true,
    },
  });

  // Usuário comum com acesso apenas ao Finance
  const userFinance = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: senhaHash,
      telefone: '11912345678',
      cpf: '98765432100',
      permissaoId: permissaoUser.id,
      ativo: true,
    },
  });

  // Usuário viewer com acesso ao Digital
  const userDigital = await prisma.usuario.create({
    data: {
      nome: 'Maria Santos',
      email: 'maria@exemplo.com',
      senha: senhaHash,
      telefone: '11999887766',
      cpf: '11122233344',
      permissaoId: permissaoViewer.id,
      ativo: true,
    },
  });

  console.log(`   ✅ ${await prisma.usuario.count()} usuários criados`);

  // ============================================
  // 5. ATRIBUIR SISTEMAS AOS USUÁRIOS
  // ============================================
  console.log('\n🔐 Atribuindo acessos aos sistemas...');
  
  // Admin tem acesso a todos os sistemas
  await prisma.usuarioProdutoSistema.createMany({
    data: [
      { usuarioId: userAdmin.id, produtoSistemaId: sistemaDigital.id, ativo: true },
      { usuarioId: userAdmin.id, produtoSistemaId: sistemaFinance.id, ativo: true },
      { usuarioId: userAdmin.id, produtoSistemaId: sistemaAcademy.id, ativo: true },
    ],
  });

  // Usuário Finance tem acesso apenas ao Finance
  await prisma.usuarioProdutoSistema.create({
    data: {
      usuarioId: userFinance.id,
      produtoSistemaId: sistemaFinance.id,
      ativo: true,
    },
  });

  // Usuário Digital tem acesso apenas ao Digital
  await prisma.usuarioProdutoSistema.create({
    data: {
      usuarioId: userDigital.id,
      produtoSistemaId: sistemaDigital.id,
      ativo: true,
    },
  });

  console.log(`   ✅ ${await prisma.usuarioProdutoSistema.count()} acessos atribuídos`);

  // ============================================
  // 6. CRIAR CLIENTES DE EXEMPLO
  // ============================================
  console.log('\n🏢 Criando clientes...');
  
  const cliente1 = await prisma.cliente.create({
    data: {
      codigo: 'CLI0000001',
      cnpjCpf: '12.345.678/0001-90',
      cnpjCpfNumerico: '12345678000190',
      tipoDocumento: 'CNPJ',
      razaoSocial: 'Empresa Exemplo LTDA',
      nomeFantasia: 'Exemplo Corp',
      email: 'contato@exemplo.com.br',
      telefone: '1133334444',
      cidade: 'São Paulo',
      estado: 'SP',
      enderecoCompleto: 'Av. Paulista, 1000 - Bela Vista',
      status: 'ATIVO',
      createdBy: userAdmin.id,
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      codigo: 'CLI0000002',
      cnpjCpf: '98.765.432/0001-10',
      cnpjCpfNumerico: '98765432000110',
      tipoDocumento: 'CNPJ',
      razaoSocial: 'Tech Solutions SA',
      nomeFantasia: 'TechSol',
      email: 'contato@techsol.com.br',
      telefone: '1144445555',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      enderecoCompleto: 'Rua da Candelária, 100 - Centro',
      status: 'ATIVO',
      createdBy: userAdmin.id,
    },
  });

  // Adicionar contatos aos clientes
  await prisma.clienteContato.createMany({
    data: [
      {
        clienteId: cliente1.id,
        tipo: 'PRINCIPAL',
        nome: 'Carlos Alberto',
        ddd: '11',
        telefone: '987654321',
        email: 'carlos@exemplo.com.br',
        recebeNotificacoes: true,
        ativo: true,
        createdBy: userAdmin.id,
      },
      {
        clienteId: cliente1.id,
        tipo: 'FINANCEIRO',
        nome: 'Ana Paula',
        ddd: '11',
        telefone: '987654322',
        email: 'financeiro@exemplo.com.br',
        recebeNotificacoes: true,
        ativo: true,
        createdBy: userAdmin.id,
      },
      {
        clienteId: cliente2.id,
        tipo: 'PRINCIPAL',
        nome: 'Roberto Lima',
        ddd: '21',
        telefone: '987654323',
        email: 'roberto@techsol.com.br',
        recebeNotificacoes: true,
        ativo: true,
        createdBy: userAdmin.id,
      },
    ],
  });

  // Adicionar dados bancários
  await prisma.clienteDadosBancarios.createMany({
    data: [
      {
        clienteId: cliente1.id,
        banco: 'Banco do Brasil',
        agencia: '1234',
        conta: '12345-6',
        tipoConta: 'CORRENTE',
        titular: 'Empresa Exemplo LTDA',
        cnpjCpfTitular: '12.345.678/0001-90',
        principal: true,
        ativo: true,
        createdBy: userAdmin.id,
      },
      {
        clienteId: cliente2.id,
        banco: 'Itaú',
        agencia: '5678',
        conta: '98765-4',
        tipoConta: 'CORRENTE',
        titular: 'Tech Solutions SA',
        cnpjCpfTitular: '98.765.432/0001-10',
        principal: true,
        ativo: true,
        createdBy: userAdmin.id,
      },
    ],
  });

  console.log(`   ✅ ${await prisma.cliente.count()} clientes criados`);
  console.log(`   ✅ ${await prisma.clienteContato.count()} contatos criados`);
  console.log(`   ✅ ${await prisma.clienteDadosBancarios.count()} contas bancárias criadas`);

  // ============================================
  // 6. FINANCE - FORMAS DE PAGAMENTO
  // ============================================
  console.log('\n💳 Criando formas de pagamento...');
  
  const formasPagamento = await Promise.all([
    prisma.financeFormaPagamento.create({
      data: { nome: 'PIX', tipo: 'A_VISTA', ativo: true },
    }),
    prisma.financeFormaPagamento.create({
      data: { nome: 'Boleto Bancário', tipo: 'A_VISTA', ativo: true },
    }),
    prisma.financeFormaPagamento.create({
      data: { nome: 'Transferência Bancária', tipo: 'A_VISTA', ativo: true },
    }),
    prisma.financeFormaPagamento.create({
      data: { nome: 'Cartão de Crédito', tipo: 'PARCELADO', ativo: true },
    }),
    prisma.financeFormaPagamento.create({
      data: { nome: 'Cartão de Débito', tipo: 'A_VISTA', ativo: true },
    }),
    prisma.financeFormaPagamento.create({
      data: { nome: 'Dinheiro', tipo: 'A_VISTA', ativo: true },
    }),
  ]);

  console.log(`   ✅ ${formasPagamento.length} formas de pagamento criadas`);

  // ============================================
  // 7. FINANCE - CATEGORIAS GLOBAIS
  // ============================================
  console.log('\n📁 Criando categorias financeiras globais...');
  
  const categoriasReceita = await Promise.all([
    prisma.financeCategoria.create({
      data: { 
        nome: 'Vendas', 
        tipo: 'RECEITA', 
        cor: '#10B981', 
        icone: 'DollarSign',
        descricao: 'Receitas de vendas de produtos/serviços',
        ativo: true 
      },
    }),
    prisma.financeCategoria.create({
      data: { 
        nome: 'Serviços', 
        tipo: 'RECEITA', 
        cor: '#3B82F6', 
        icone: 'Briefcase',
        descricao: 'Receitas de prestação de serviços',
        ativo: true 
      },
    }),
    prisma.financeCategoria.create({
      data: { 
        nome: 'Comissões', 
        tipo: 'RECEITA', 
        cor: '#8B5CF6', 
        icone: 'TrendingUp',
        descricao: 'Comissões recebidas',
        ativo: true 
      },
    }),
  ]);

  const categoriasDespesa = await Promise.all([
    prisma.financeCategoria.create({
      data: { 
        nome: 'Aluguel', 
        tipo: 'DESPESA', 
        cor: '#EF4444', 
        icone: 'Home',
        descricao: 'Pagamentos de aluguel',
        ativo: true 
      },
    }),
    prisma.financeCategoria.create({
      data: { 
        nome: 'Salários', 
        tipo: 'DESPESA', 
        cor: '#F59E0B', 
        icone: 'Users',
        descricao: 'Folha de pagamento',
        ativo: true 
      },
    }),
    prisma.financeCategoria.create({
      data: { 
        nome: 'Fornecedores', 
        tipo: 'DESPESA', 
        cor: '#EC4899', 
        icone: 'Package',
        descricao: 'Pagamentos a fornecedores',
        ativo: true 
      },
    }),
    prisma.financeCategoria.create({
      data: { 
        nome: 'Impostos e Taxas', 
        tipo: 'DESPESA', 
        cor: '#6366F1', 
        icone: 'FileText',
        descricao: 'Impostos, taxas e tributos',
        ativo: true 
      },
    }),
  ]);

  console.log(`   ✅ ${categoriasReceita.length} categorias de receita criadas`);
  console.log(`   ✅ ${categoriasDespesa.length} categorias de despesa criadas`);

  // ============================================
  // 8. FINANCE - DADOS DE TESTE PARA DAYANE
  // ============================================
  console.log('\n💰 Criando dados de teste do Finance para Dayane...');

  // Conta Bancária
  const contaBancaria = await prisma.financeContaBancaria.create({
    data: {
      usuarioId: userAdmin.id,
      banco: 'Banco do Brasil',
      agencia: '1234-5',
      conta: '12345-6',
      tipoConta: 'CORRENTE',
      saldoInicial: 10000.00,
      saldoAtual: 10000.00,
      chavePix: 'dayane_paz@gmail.com',
      principal: true,
      ativo: true,
    },
  });

  // Clientes do Finance
  const financeCliente1 = await prisma.financeCliente.create({
    data: {
      usuarioId: userAdmin.id,
      nome: 'Tech Solutions LTDA',
      cpfCnpj: '12.345.678/0001-90',
      email: 'contato@techsolutions.com',
      telefone: '(11) 98765-4321',
      ativo: true,
    },
  });

  const financeCliente2 = await prisma.financeCliente.create({
    data: {
      usuarioId: userAdmin.id,
      nome: 'ABC Comércio S.A.',
      cpfCnpj: '98.765.432/0001-10',
      email: 'financeiro@abc.com.br',
      telefone: '(11) 91234-5678',
      ativo: true,
    },
  });

  // Fornecedor
  const fornecedor1 = await prisma.financeFornecedor.create({
    data: {
      usuarioId: userAdmin.id,
      nome: 'TechSupply Informática',
      cpfCnpj: '11.222.333/0001-44',
      email: 'vendas@techsupply.com',
      telefone: '(11) 3333-4444',
      ativo: true,
    },
  });

  console.log('   ✅ Conta bancária criada');
  console.log('   ✅ 2 clientes criados');
  console.log('   ✅ 1 fornecedor criado');

  // Configuração de Alertas
  await prisma.financeConfiguracaoAlerta.create({
    data: {
      usuarioId: userAdmin.id,
      contasVencerAtivo: true,
      contasVencerDias: 3,
      contasVencidasAtivo: true,
      limiteContaBancariaAtivo: false,
      emailNotificacao: true,
      notificacaoSistema: true,
    },
  });

  console.log('   ✅ Configuração de alertas criada');

  // ============================================
  // RESUMO
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('✅ SEED CONCLUÍDO COM SUCESSO!');
  console.log('='.repeat(60));
  console.log('\n📊 Resumo do banco de dados:');
  console.log(`   - ${await prisma.permissao.count()} permissões`);
  console.log(`   - ${await prisma.produtoSistema.count()} sistemas`);
  console.log(`   - ${await prisma.produto.count()} produtos/módulos`);
  console.log(`   - ${await prisma.usuario.count()} usuários`);
  console.log(`   - ${await prisma.usuarioProdutoSistema.count()} acessos a sistemas`);
  console.log(`   - ${await prisma.cliente.count()} clientes (Digital)`);
  console.log(`   - ${await prisma.clienteContato.count()} contatos`);
  console.log(`   - ${await prisma.clienteDadosBancarios.count()} contas bancárias (Digital)`);
  console.log(`\n💰 Finance:`);
  console.log(`   - ${await prisma.financeFormaPagamento.count()} formas de pagamento`);
  console.log(`   - ${await prisma.financeCategoria.count()} categorias`);
  console.log(`   - ${await prisma.financeContaBancaria.count()} contas bancárias`);
  console.log(`   - ${await prisma.financeCliente.count()} clientes`);
  console.log(`   - ${await prisma.financeFornecedor.count()} fornecedores`);
  console.log(`   - ${await prisma.financeConfiguracaoAlerta.count()} configurações de alerta`);
  
  console.log('\n👤 Usuários de teste:');
  console.log('   1. Admin (acesso total):');
  console.log('      Email: dayane_paz@gmail.com');
  console.log('      Senha: Pazygor080@');
  console.log('      Sistemas: Digital, Finance, Academy');
  console.log('   2. Usuário Finance:');
  console.log('      Email: joao@exemplo.com');
  console.log('      Senha: Pazygor080@');
  console.log('      Sistemas: Finance');
  console.log('   3. Usuário Digital:');
  console.log('      Email: maria@exemplo.com');
  console.log('      Senha: Pazygor080@');
  console.log('      Sistemas: Digital');
  console.log('='.repeat(60) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
