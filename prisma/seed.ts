import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (em ordem de dependência)
  // Academy
  await prisma.academyAnotacao.deleteMany();
  await prisma.academyAvaliacao.deleteMany();
  await prisma.academyCertificado.deleteMany();
  await prisma.academyProgresso.deleteMany();
  await prisma.academyMatricula.deleteMany();
  await prisma.academyAula.deleteMany();
  await prisma.academyModulo.deleteMany();
  await prisma.academyCurso.deleteMany();
  await prisma.academyInstrutor.deleteMany();
  await prisma.academyCategoria.deleteMany();
  
  // Finance
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
  // 9. ACADEMY - CATEGORIAS DE CURSOS
  // ============================================
  console.log('\n🎓 Criando dados do Academy...');
  
  const catContabilidadeBasica = await prisma.academyCategoria.create({
    data: {
      nome: 'Contabilidade Básica',
      slug: 'contabilidade-basica',
      descricao: 'Fundamentos essenciais da contabilidade',
      icone: 'BookOpen',
      cor: '#3B82F6',
      ordem: 1,
      ativo: true,
    },
  });

  const catFiscal = await prisma.academyCategoria.create({
    data: {
      nome: 'Contabilidade Fiscal',
      slug: 'contabilidade-fiscal',
      descricao: 'Tributos, obrigações fiscais e legislação',
      icone: 'FileText',
      cor: '#EF4444',
      ordem: 2,
      ativo: true,
    },
  });

  const catTrabalhista = await prisma.academyCategoria.create({
    data: {
      nome: 'Departamento Pessoal',
      slug: 'departamento-pessoal',
      descricao: 'Folha de pagamento e legislação trabalhista',
      icone: 'Users',
      cor: '#10B981',
      ordem: 3,
      ativo: true,
    },
  });

  const catGerencial = await prisma.academyCategoria.create({
    data: {
      nome: 'Contabilidade Gerencial',
      slug: 'contabilidade-gerencial',
      descricao: 'Análise de custos e tomada de decisões',
      icone: 'TrendingUp',
      cor: '#8B5CF6',
      ordem: 4,
      ativo: true,
    },
  });

  console.log(`   ✅ ${await prisma.academyCategoria.count()} categorias de cursos criadas`);

  // ============================================
  // 10. ACADEMY - INSTRUTORES
  // ============================================
  console.log('   Criando instrutores...');
  
  const instrutor1 = await prisma.academyInstrutor.create({
    data: {
      nome: 'Dr. Carlos Mendes',
      email: 'carlos.mendes@visionday.com.br',
      biografia: 'Contador com mais de 15 anos de experiência em contabilidade fiscal e tributária. Mestre em Ciências Contábeis pela USP.',
      foto: 'https://randomuser.me/api/portraits/men/32.jpg',
      especialidades: JSON.stringify(['Contabilidade Fiscal', 'Tributos', 'SPED']),
      linkedin: 'linkedin.com/in/carlosmendes',
      ativo: true,
    },
  });

  const instrutor2 = await prisma.academyInstrutor.create({
    data: {
      nome: 'Profa. Ana Paula Silva',
      email: 'ana.silva@visionday.com.br',
      biografia: 'Especialista em Departamento Pessoal e legislação trabalhista. Professora universitária há 10 anos.',
      foto: 'https://randomuser.me/api/portraits/women/44.jpg',
      especialidades: JSON.stringify(['Departamento Pessoal', 'eSocial', 'Folha de Pagamento']),
      linkedin: 'linkedin.com/in/anapaula',
      ativo: true,
    },
  });

  const instrutor3 = await prisma.academyInstrutor.create({
    data: {
      nome: 'Roberto Santos',
      email: 'roberto.santos@visionday.com.br',
      biografia: 'Contador e consultor empresarial. Especialista em contabilidade gerencial e análise de demonstrações financeiras.',
      foto: 'https://randomuser.me/api/portraits/men/52.jpg',
      especialidades: JSON.stringify(['Contabilidade Gerencial', 'Análise Financeira', 'Custos']),
      linkedin: 'linkedin.com/in/robertosantos',
      ativo: true,
    },
  });

  console.log(`   ✅ ${await prisma.academyInstrutor.count()} instrutores criados`);

  // ============================================
  // 11. ACADEMY - CURSOS
  // ============================================
  console.log('   Criando cursos...');
  
  const curso1 = await prisma.academyCurso.create({
    data: {
      categoriaId: catContabilidadeBasica.id,
      instrutorId: instrutor1.id,
      titulo: 'Fundamentos da Contabilidade',
      slug: 'fundamentos-da-contabilidade',
      descricao: 'Aprenda os conceitos básicos e essenciais da contabilidade de forma prática e objetiva.',
      descricaoCompleta: 'Este curso aborda os fundamentos da contabilidade, incluindo partidas dobradas, plano de contas, lançamentos contábeis e demonstrações financeiras básicas.',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      duracao: 180,
      nivel: 'INICIANTE',
      gratuito: true,
      certificado: true,
      cargaHoraria: 3,
      tags: JSON.stringify(['contabilidade', 'básico', 'iniciante', 'fundamentos']),
      objetivos: JSON.stringify([
        'Entender os princípios contábeis',
        'Realizar lançamentos contábeis',
        'Interpretar demonstrações financeiras',
        'Aplicar partidas dobradas',
      ]),
      requisitos: JSON.stringify(['Nenhum conhecimento prévio necessário']),
      oqueLearned: JSON.stringify([
        'Princípios fundamentais da contabilidade',
        'Sistema de partidas dobradas',
        'Plano de contas e classificações',
        'Lançamentos contábeis',
        'Balanço patrimonial e DRE',
      ]),
      totalAulas: 12,
      totalAlunos: 0,
      avaliacaoMedia: 0,
      totalAvaliacoes: 0,
      publicado: true,
      dataPublicacao: new Date(),
      destaque: true,
      ativo: true,
    },
  });

  const curso2 = await prisma.academyCurso.create({
    data: {
      categoriaId: catFiscal.id,
      instrutorId: instrutor1.id,
      titulo: 'Contabilidade Fiscal e Tributária',
      slug: 'contabilidade-fiscal-tributaria',
      descricao: 'Domine os principais tributos e obrigações fiscais das empresas brasileiras.',
      descricaoCompleta: 'Curso completo sobre contabilidade fiscal, abordando ICMS, IPI, PIS, COFINS, IRPJ, CSLL e principais obrigações acessórias.',
      thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      duracao: 360,
      nivel: 'INTERMEDIARIO',
      gratuito: false,
      preco: 297.00,
      certificado: true,
      cargaHoraria: 6,
      tags: JSON.stringify(['fiscal', 'tributos', 'impostos', 'SPED']),
      objetivos: JSON.stringify([
        'Dominar os principais tributos brasileiros',
        'Entender regimes tributários',
        'Conhecer obrigações acessórias',
        'Trabalhar com SPED Fiscal',
      ]),
      requisitos: JSON.stringify(['Conhecimentos básicos de contabilidade']),
      oqueLearned: JSON.stringify([
        'Tributos federais, estaduais e municipais',
        'Lucro Real, Presumido e Simples Nacional',
        'SPED Fiscal e EFD-Contribuições',
        'Planejamento tributário básico',
        'Cálculo e apuração de tributos',
      ]),
      totalAulas: 24,
      totalAlunos: 0,
      avaliacaoMedia: 0,
      totalAvaliacoes: 0,
      publicado: true,
      dataPublicacao: new Date(),
      destaque: true,
      ativo: true,
    },
  });

  const curso3 = await prisma.academyCurso.create({
    data: {
      categoriaId: catTrabalhista.id,
      instrutorId: instrutor2.id,
      titulo: 'Departamento Pessoal Completo',
      slug: 'departamento-pessoal-completo',
      descricao: 'Do básico ao avançado em folha de pagamento, eSocial e legislação trabalhista.',
      descricaoCompleta: 'Curso completo de Departamento Pessoal, abordando admissão, folha de pagamento, férias, rescisão, eSocial e legislação trabalhista atualizada.',
      thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      duracao: 480,
      nivel: 'INTERMEDIARIO',
      gratuito: false,
      preco: 397.00,
      certificado: true,
      cargaHoraria: 8,
      tags: JSON.stringify(['DP', 'folha', 'trabalhista', 'eSocial']),
      objetivos: JSON.stringify([
        'Realizar processos de admissão e rescisão',
        'Calcular folha de pagamento',
        'Dominar eSocial',
        'Aplicar legislação trabalhista',
      ]),
      requisitos: JSON.stringify(['Conhecimentos básicos de legislação']),
      oqueLearned: JSON.stringify([
        'Admissão de colaboradores',
        'Cálculo de folha de pagamento',
        'Férias e 13º salário',
        'Rescisão contratual',
        'eSocial na prática',
        'Direitos trabalhistas',
      ]),
      totalAulas: 32,
      totalAlunos: 0,
      avaliacaoMedia: 0,
      totalAvaliacoes: 0,
      publicado: true,
      dataPublicacao: new Date(),
      destaque: false,
      ativo: true,
    },
  });

  const curso4 = await prisma.academyCurso.create({
    data: {
      categoriaId: catGerencial.id,
      instrutorId: instrutor3.id,
      titulo: 'Análise de Demonstrações Financeiras',
      slug: 'analise-demonstracoes-financeiras',
      descricao: 'Aprenda a analisar e interpretar demonstrações financeiras para tomada de decisões.',
      descricaoCompleta: 'Curso focado em análise financeira, abordando indicadores, índices de liquidez, rentabilidade, endividamento e análise vertical/horizontal.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      duracao: 240,
      nivel: 'AVANCADO',
      gratuito: false,
      preco: 247.00,
      certificado: true,
      cargaHoraria: 4,
      tags: JSON.stringify(['análise', 'financeiro', 'gerencial', 'indicadores']),
      objetivos: JSON.stringify([
        'Interpretar demonstrações financeiras',
        'Calcular e analisar indicadores',
        'Realizar análise vertical e horizontal',
        'Apoiar decisões gerenciais',
      ]),
      requisitos: JSON.stringify(['Conhecimentos intermediários de contabilidade']),
      oqueLearned: JSON.stringify([
        'Análise de Balanço Patrimonial e DRE',
        'Índices de liquidez',
        'Índices de rentabilidade',
        'Índices de endividamento',
        'Análise vertical e horizontal',
        'Relatórios gerenciais',
      ]),
      totalAulas: 16,
      totalAlunos: 0,
      avaliacaoMedia: 0,
      totalAvaliacoes: 0,
      publicado: true,
      dataPublicacao: new Date(),
      destaque: false,
      ativo: true,
    },
  });

  const curso5 = await prisma.academyCurso.create({
    data: {
      categoriaId: catContabilidadeBasica.id,
      instrutorId: instrutor3.id,
      titulo: 'Excel para Contadores',
      slug: 'excel-para-contadores',
      descricao: 'Domine o Excel aplicado à contabilidade e finanças.',
      descricaoCompleta: 'Curso prático de Excel focado em contadores, com fórmulas, tabelas dinâmicas, macros básicas e dashboards financeiros.',
      thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
      duracao: 300,
      nivel: 'INICIANTE',
      gratuito: true,
      certificado: true,
      cargaHoraria: 5,
      tags: JSON.stringify(['excel', 'ferramentas', 'produtividade', 'prático']),
      objetivos: JSON.stringify([
        'Dominar fórmulas essenciais',
        'Criar tabelas dinâmicas',
        'Automatizar tarefas',
        'Desenvolver dashboards',
      ]),
      requisitos: JSON.stringify(['Conhecimentos básicos de informática']),
      oqueLearned: JSON.stringify([
        'Fórmulas e funções avançadas',
        'Tabelas dinâmicas',
        'Formatação condicional',
        'Gráficos profissionais',
        'Macros básicas',
        'Dashboards financeiros',
      ]),
      totalAulas: 20,
      totalAlunos: 0,
      avaliacaoMedia: 0,
      totalAvaliacoes: 0,
      publicado: true,
      dataPublicacao: new Date(),
      destaque: true,
      ativo: true,
    },
  });

  console.log(`   ✅ ${await prisma.academyCurso.count()} cursos criados`);

  // ============================================
  // 12. ACADEMY - MÓDULOS E AULAS DO CURSO 1
  // ============================================
  console.log('   Criando módulos e aulas...');
  
  // Módulo 1 do Curso 1
  const modulo1 = await prisma.academyModulo.create({
    data: {
      cursoId: curso1.id,
      titulo: 'Introdução à Contabilidade',
      descricao: 'Conceitos iniciais e história da contabilidade',
      ordem: 1,
      duracao: 45,
      ativo: true,
    },
  });

  await prisma.academyAula.createMany({
    data: [
      {
        moduloId: modulo1.id,
        instrutorId: instrutor1.id,
        titulo: 'Bem-vindo ao curso',
        descricao: 'Apresentação do curso e metodologia',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 300,
        ordem: 1,
        gratuita: true,
        ativo: true,
      },
      {
        moduloId: modulo1.id,
        instrutorId: instrutor1.id,
        titulo: 'O que é Contabilidade?',
        descricao: 'Definição, objetivos e importância da contabilidade',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 900,
        ordem: 2,
        gratuita: true,
        ativo: true,
      },
      {
        moduloId: modulo1.id,
        instrutorId: instrutor1.id,
        titulo: 'História da Contabilidade',
        descricao: 'Evolução histórica da contabilidade',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 600,
        ordem: 3,
        gratuita: false,
        ativo: true,
      },
      {
        moduloId: modulo1.id,
        instrutorId: instrutor1.id,
        titulo: 'Princípios Contábeis',
        descricao: 'Os princípios fundamentais da contabilidade',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 1200,
        ordem: 4,
        gratuita: false,
        ativo: true,
      },
    ],
  });

  // Módulo 2 do Curso 1
  const modulo2 = await prisma.academyModulo.create({
    data: {
      cursoId: curso1.id,
      titulo: 'Patrimônio e Plano de Contas',
      descricao: 'Entendendo o patrimônio e estrutura de contas',
      ordem: 2,
      duracao: 60,
      ativo: true,
    },
  });

  await prisma.academyAula.createMany({
    data: [
      {
        moduloId: modulo2.id,
        instrutorId: instrutor1.id,
        titulo: 'Conceito de Patrimônio',
        descricao: 'Ativo, Passivo e Patrimônio Líquido',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 1500,
        ordem: 1,
        gratuita: false,
        ativo: true,
      },
      {
        moduloId: modulo2.id,
        instrutorId: instrutor1.id,
        titulo: 'Plano de Contas',
        descricao: 'Estrutura e organização do plano de contas',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 1200,
        ordem: 2,
        gratuita: false,
        ativo: true,
      },
      {
        moduloId: modulo2.id,
        instrutorId: instrutor1.id,
        titulo: 'Classificação de Contas',
        descricao: 'Como classificar contas contábeis',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 900,
        ordem: 3,
        gratuita: false,
        ativo: true,
      },
      {
        moduloId: modulo2.id,
        instrutorId: instrutor1.id,
        titulo: 'Exercícios Práticos',
        descricao: 'Exercícios de fixação sobre patrimônio',
        tipo: 'TEXTO',
        conteudoTexto: '# Exercícios de Fixação\n\n1. Classifique as seguintes contas...',
        duracao: 1200,
        ordem: 4,
        gratuita: false,
        recursos: JSON.stringify([
          { tipo: 'pdf', nome: 'Lista de Exercícios.pdf', url: '#' },
          { tipo: 'pdf', nome: 'Gabarito.pdf', url: '#' },
        ]),
        ativo: true,
      },
    ],
  });

  // Módulo 3 do Curso 1
  const modulo3 = await prisma.academyModulo.create({
    data: {
      cursoId: curso1.id,
      titulo: 'Lançamentos Contábeis',
      descricao: 'Débito, crédito e método das partidas dobradas',
      ordem: 3,
      duracao: 75,
      ativo: true,
    },
  });

  await prisma.academyAula.createMany({
    data: [
      {
        moduloId: modulo3.id,
        instrutorId: instrutor1.id,
        titulo: 'Sistema de Partidas Dobradas',
        descricao: 'Fundamento do método de partidas dobradas',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 1800,
        ordem: 1,
        gratuita: false,
        ativo: true,
      },
      {
        moduloId: modulo3.id,
        instrutorId: instrutor1.id,
        titulo: 'Débito e Crédito',
        descricao: 'Entendendo débito e crédito na prática',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 1500,
        ordem: 2,
        gratuita: false,
        ativo: true,
      },
      {
        moduloId: modulo3.id,
        instrutorId: instrutor1.id,
        titulo: 'Lançamentos Básicos',
        descricao: 'Como realizar lançamentos contábeis',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 1200,
        ordem: 3,
        gratuita: false,
        ativo: true,
      },
      {
        moduloId: modulo3.id,
        instrutorId: instrutor1.id,
        titulo: 'Prática de Lançamentos',
        descricao: 'Exercícios práticos de lançamentos',
        tipo: 'VIDEO',
        conteudoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duracao: 2000,
        ordem: 4,
        gratuita: false,
        ativo: true,
      },
    ],
  });

  console.log(`   ✅ ${await prisma.academyModulo.count()} módulos criados`);
  console.log(`   ✅ ${await prisma.academyAula.count()} aulas criadas`);

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
  
  console.log(`\n🎓 Academy:`);
  console.log(`   - ${await prisma.academyCategoria.count()} categorias de cursos`);
  console.log(`   - ${await prisma.academyInstrutor.count()} instrutores`);
  console.log(`   - ${await prisma.academyCurso.count()} cursos`);
  console.log(`   - ${await prisma.academyModulo.count()} módulos`);
  console.log(`   - ${await prisma.academyAula.count()} aulas`);
  
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
