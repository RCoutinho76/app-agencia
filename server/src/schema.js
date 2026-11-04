import { pool } from './db.js';

const DDL = `
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  data_nascimento DATE,
  cpf TEXT,
  celular TEXT,
  email TEXT,
  passaporte_numero TEXT,
  passaporte_validade DATE,
  vistos JSONB NOT NULL DEFAULT '[]'::jsonb,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias_produto (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  icone TEXT NOT NULL DEFAULT 'Package',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS itens_produto (
  id SERIAL PRIMARY KEY,
  categoria_id INTEGER NOT NULL REFERENCES categorias_produto(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  fornecedor TEXT,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS roteiros (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  destino TEXT NOT NULL,
  data_ida DATE NOT NULL,
  data_volta DATE NOT NULL,
  imagem_capa TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho',
  data_aprovacao TIMESTAMPTZ,
  valor_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  observacoes_cliente TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS etapas_roteiro (
  id SERIAL PRIMARY KEY,
  roteiro_id INTEGER NOT NULL REFERENCES roteiros(id) ON DELETE CASCADE,
  dia_numero INTEGER NOT NULL,
  data DATE NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 1,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL DEFAULT 'outro',
  horario TEXT,
  imagem TEXT,
  voucher_url TEXT,
  voucher_codigo TEXT
);

CREATE TABLE IF NOT EXISTS lancamentos_financeiros (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  roteiro_id INTEGER REFERENCES roteiros(id) ON DELETE SET NULL,
  categoria_id INTEGER NOT NULL REFERENCES categorias_produto(id),
  item_comprado TEXT NOT NULL,
  valor_total_venda NUMERIC(12,2) NOT NULL DEFAULT 0,
  comissao_liquida NUMERIC(12,2) NOT NULL DEFAULT 0,
  data_venda DATE NOT NULL,
  contrato_fechado BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS etapas_roteiro_roteiro_idx ON etapas_roteiro (roteiro_id);
CREATE INDEX IF NOT EXISTS lancamentos_cliente_idx ON lancamentos_financeiros (cliente_id);
`;

const clientes = [
  {
    nome_completo: 'Ana Beatriz Moraes',
    data_nascimento: '1988-05-12',
    cpf: '123.456.789-00',
    celular: '(11) 98876-5432',
    email: 'ana.moraes@email.com',
    passaporte_numero: 'FZ123456',
    passaporte_validade: '2030-04-12',
    vistos: [{ pais: 'Espaço Schengen', validade: '2028-03-01', descricao: '' }],
    observacoes: 'Prefere voos diretos e hotel com vista para o mar.',
  },
  {
    nome_completo: 'Carlos Eduardo Lima',
    data_nascimento: '1979-11-03',
    cpf: '234.567.890-11',
    celular: '(21) 99654-2210',
    email: 'carlos.lima@email.com',
    passaporte_numero: 'BR998877',
    passaporte_validade: '2029-08-20',
    vistos: [],
    observacoes: 'Viaja sempre com a esposa; gosta de roteiros com neve.',
  },
  {
    nome_completo: 'Fernanda Souza Ribeiro',
    data_nascimento: '1992-02-27',
    cpf: '345.678.901-22',
    celular: '(31) 99123-8877',
    email: 'fernanda.ribeiro@email.com',
    passaporte_numero: 'FZ445566',
    passaporte_validade: '2031-01-15',
    vistos: [{ pais: 'EUA', validade: '2027-06-30', descricao: '' }],
    observacoes: 'Sempre pede upgrade de quarto quando disponível.',
  },
  {
    nome_completo: 'João Pedro Almeida',
    data_nascimento: '1985-07-19',
    cpf: '456.789.012-33',
    celular: '(41) 98800-4433',
    email: 'joao.almeida@email.com',
    passaporte_numero: 'FZ778899',
    passaporte_validade: '2028-12-05',
    vistos: [],
    observacoes: 'Cliente corporativo — viagens a trabalho com nota fiscal.',
  },
  {
    nome_completo: 'Mariana Castro Nunes',
    data_nascimento: '1995-09-08',
    cpf: '567.890.123-44',
    celular: '(51) 99771-6620',
    email: 'mariana.nunes@email.com',
    passaporte_numero: 'FZ334455',
    passaporte_validade: '2032-02-11',
    vistos: [
      { pais: 'Japão', validade: '2027-11-20', descricao: '' },
      { pais: 'Canadá', validade: '2029-05-10', descricao: '' },
    ],
    observacoes: 'Lua de mel em Noronha em janeiro.',
  },
  {
    nome_completo: 'Rafael Tanaka',
    data_nascimento: '1990-12-01',
    cpf: '678.901.234-55',
    celular: '(11) 97744-1290',
    email: 'rafael.tanaka@email.com',
    passaporte_numero: 'FZ112233',
    passaporte_validade: '2030-09-22',
    vistos: [],
    observacoes: 'Indicado por cliente antigo.',
  },
];

const categorias = [
  ['Passagens Aéreas', 'Voos nacionais e internacionais', 'Plane', 1],
  ['Hotéis', 'Hospedagem em redes e boutiques', 'Hotel', 2],
  ['Aluguel de Carros', 'Locadoras parceiras', 'Car', 3],
  ['Pacotes', 'Roteiros fechados', 'Package', 4],
];

const itens = [
  [0, 'Passagem LATAM — GRU/ATH', 'LATAM Airlines', 'Trecho ida e volta, bagagem de 23 kg.'],
  [0, 'Passagem TAP — GRU/LIS', 'TAP Air Portugal', 'Tarifa flex com remarcação gratuita.'],
  [1, 'Katikies Santorini', 'Katikies Hotels', 'Suíte com varanda, café da manhã incluso.'],
  [1, 'Llao Llao Resort', 'Llao Llao', 'Lago Nahuel Huapi, meia pensão.'],
  [1, 'Pousada Maravilha', 'Pousada Maravilha', 'Bangalô com piscina privativa.'],
  [2, 'Aluguel de carro — Lisboa', 'Europcar', 'Grupo C, seguro completo, 5 dias.'],
  [3, 'Pacote Santorini 9 noites', 'Viagens & Cia', 'Aéreo + hotel + traslados.'],
  [3, 'Pacote Noronha Lua de Mel', 'Nordeste Travel', 'Aéreo + pousada + passeios.'],
];

const roteiros = [
  {
    cliente: 0,
    titulo: 'Santorini em Família',
    destino: 'Santorini, Grécia',
    data_ida: '2026-11-20',
    data_volta: '2026-11-29',
    status: 'aprovado',
    valor_total: 48900,
    observacoes_cliente: 'Quarto com varanda e café da manhã incluso para 2 adultos e 1 criança.',
  },
  {
    cliente: 1,
    titulo: 'Neve em Bariloche',
    destino: 'Bariloche, Argentina',
    data_ida: '2026-12-10',
    data_volta: '2026-12-15',
    status: 'enviado',
    valor_total: 28900,
    observacoes_cliente: 'Aguardando confirmação do hotel até sexta-feira.',
  },
  {
    cliente: 4,
    titulo: 'Lua de Mel em Noronha',
    destino: 'Fernando de Noronha, Brasil',
    data_ida: '2027-01-08',
    data_volta: '2027-01-14',
    status: 'aprovado',
    valor_total: 18500,
    observacoes_cliente: 'Quer jantar especial no último dia.',
  },
  {
    cliente: 3,
    titulo: 'Corporativo — Lisboa',
    destino: 'Lisboa, Portugal',
    data_ida: '2027-02-03',
    data_volta: '2027-02-08',
    status: 'rascunho',
    valor_total: 15200,
    observacoes_cliente: 'Emitir nota fiscal no CNPJ da empresa.',
  },
];

const etapasPorRoteiro = [
  [
    { dia: 1, data: '2026-11-20', ordem: 1, tipo: 'voo', horario: '22:30', titulo: 'Embarque GRU → Atenas', descricao: 'LATAM LA 8122 com conexão em Lisboa. Bagagem despachada para 2 passageiros.' },
    { dia: 2, data: '2026-11-21', ordem: 1, tipo: 'traslado', horario: '14:10', titulo: 'Traslado privativo aeroporto → Oia', descricao: 'Motorista com placa identificada na saída do desembarque.' },
    { dia: 2, data: '2026-11-21', ordem: 2, tipo: 'hotel', horario: '15:00', titulo: 'Check-in Katikies Santorini', descricao: 'Suíte com varanda e café da manhã incluso. 8 noites.', voucher_codigo: 'KAT-8891' },
    { dia: 3, data: '2026-11-22', ordem: 1, tipo: 'passeio', horario: '17:30', titulo: 'Pôr do sol em Oia', descricao: 'Reserva no terraço do Kastro. Chegar com 30 minutos de antecedência.' },
    { dia: 5, data: '2026-11-24', ordem: 1, tipo: 'passeio', horario: '10:00', titulo: 'Cruzeiro pela caldeira', descricao: 'Catamarã com almoço a bordo e parada para banho nas fontes termais.' },
    { dia: 8, data: '2026-11-27', ordem: 1, tipo: 'refeicao', horario: '20:00', titulo: 'Jantar de aniversário em Ammoudi', descricao: 'Reserva para 4 pessoas na taverna Dimitris.' },
    { dia: 10, data: '2026-11-29', ordem: 1, tipo: 'voo', horario: '09:15', titulo: 'Retorno Atenas → GRU', descricao: 'Check-out às 7h e traslado já confirmado.' },
  ],
  [
    { dia: 1, data: '2026-12-10', ordem: 1, tipo: 'voo', horario: '08:40', titulo: 'Embarque GRU → Bariloche', descricao: 'Voo com conexão em Buenos Aires.' },
    { dia: 1, data: '2026-12-10', ordem: 2, tipo: 'hotel', horario: '15:30', titulo: 'Check-in Llao Llao Resort', descricao: 'Meia pensão, quarto com vista para o lago. 5 noites.', voucher_codigo: 'LLA-2210' },
    { dia: 2, data: '2026-12-11', ordem: 1, tipo: 'passeio', horario: '09:00', titulo: 'Circuito Chico', descricao: 'Meio dia de passeio com paradas nos mirantes.' },
    { dia: 3, data: '2026-12-12', ordem: 1, tipo: 'passeio', horario: '08:30', titulo: 'Cerro Catedral — aula de esqui', descricao: 'Aula em dupla com instrutor, equipamento incluso.' },
    { dia: 6, data: '2026-12-15', ordem: 1, tipo: 'voo', horario: '18:20', titulo: 'Retorno Bariloche → GRU', descricao: 'Traslado do hotel ao aeroporto às 15h.' },
  ],
  [
    { dia: 1, data: '2027-01-08', ordem: 1, tipo: 'voo', horario: '07:20', titulo: 'Embarque REC → Fernando de Noronha', descricao: 'Taxa de preservação já inclusa na proposta.' },
    { dia: 1, data: '2027-01-08', ordem: 2, tipo: 'hotel', horario: '12:30', titulo: 'Check-in Pousada Maravilha', descricao: 'Bangalô com piscina privativa. 6 noites.', voucher_codigo: 'MAR-5510' },
    { dia: 2, data: '2027-01-09', ordem: 1, tipo: 'passeio', horario: '09:00', titulo: 'Baía do Sancho com guia', descricao: 'Saída de buggy do hotel, guia credenciado.' },
    { dia: 4, data: '2027-01-11', ordem: 1, tipo: 'passeio', horario: '10:00', titulo: 'Passeio de barco — golfinhos', descricao: 'Catamarã com parada para snorkel.' },
    { dia: 7, data: '2027-01-14', ordem: 1, tipo: 'voo', horario: '16:40', titulo: 'Retorno Fernando de Noronha → REC', descricao: 'Check-out às 11h.' },
  ],
  [
    { dia: 1, data: '2027-02-03', ordem: 1, tipo: 'voo', horario: '20:10', titulo: 'Embarque GRU → Lisboa', descricao: 'TAP Air Portugal, classe executiva.' },
    { dia: 2, data: '2027-02-04', ordem: 1, tipo: 'hotel', horario: '14:00', titulo: 'Check-in Hotel Avenida Palace', descricao: 'Café da manhã incluso, 5 noites.' },
    { dia: 3, data: '2027-02-05', ordem: 1, tipo: 'carro', horario: '09:00', titulo: 'Retirada do carro no aeroporto', descricao: 'Europcar, seguro completo, devolução no mesmo local.' },
    { dia: 6, data: '2027-02-08', ordem: 1, tipo: 'voo', horario: '11:30', titulo: 'Retorno Lisboa → GRU', descricao: 'Devolução do carro às 9h no aeroporto.' },
  ],
];

const lancamentos = [
  { cliente: 0, roteiro: 0, categoria: 3, item: 'Pacote Santorini 9 noites — 2 adultos', valor: 48900, comissao: 4890, data: '2026-10-12' },
  { cliente: 0, roteiro: 0, categoria: 0, item: 'Passagens LATAM GRU/ATH (2 pax)', valor: 12400, comissao: 1240, data: '2026-10-12' },
  { cliente: 1, roteiro: 1, categoria: 1, item: 'Hotel Llao Llao — 5 noites', valor: 9800, comissao: 980, data: '2026-09-28' },
  { cliente: 1, roteiro: 1, categoria: 0, item: 'Passagens Aerolíneas GRU/BRC (2 pax)', valor: 6300, comissao: 630, data: '2026-09-28' },
  { cliente: 4, roteiro: 2, categoria: 3, item: 'Pacote Lua de Mel Noronha — 6 noites', valor: 18500, comissao: 1850, data: '2026-10-02' },
  { cliente: 3, roteiro: 3, categoria: 2, item: 'Aluguel de carro Lisboa — 5 dias', valor: 2450, comissao: 245, data: '2026-08-14' },
  { cliente: 4, roteiro: 2, categoria: 1, item: 'Pousada Maravilha — 6 noites', valor: 7200, comissao: 720, data: '2026-10-02' },
  { cliente: 2, roteiro: null, categoria: 0, item: 'Passagens Azul POA/GRU/POA', valor: 3100, comissao: 310, data: '2026-07-21' },
  { cliente: 5, roteiro: null, categoria: 1, item: 'Hotel Copacabana Palace — 2 noites', valor: 5400, comissao: 540, data: '2026-06-30' },
];

async function seed() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM clientes');
  if (rows[0].total > 0) return;

  const clienteIds = [];
  for (const cliente of clientes) {
    const result = await pool.query(
      `INSERT INTO clientes
        (nome_completo, data_nascimento, cpf, celular, email, passaporte_numero, passaporte_validade, vistos, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)
       RETURNING id`,
      [
        cliente.nome_completo,
        cliente.data_nascimento,
        cliente.cpf,
        cliente.celular,
        cliente.email,
        cliente.passaporte_numero,
        cliente.passaporte_validade,
        JSON.stringify(cliente.vistos),
        cliente.observacoes,
      ],
    );
    clienteIds.push(result.rows[0].id);
  }

  const categoriaIds = [];
  for (const [nome, descricao, icone, ordem] of categorias) {
    const result = await pool.query(
      'INSERT INTO categorias_produto (nome, descricao, icone, ordem, ativo) VALUES ($1, $2, $3, $4, TRUE) RETURNING id',
      [nome, descricao, icone, ordem],
    );
    categoriaIds.push(result.rows[0].id);
  }

  for (const [categoria, nome, fornecedor, descricao] of itens) {
    await pool.query(
      'INSERT INTO itens_produto (categoria_id, nome, fornecedor, descricao, ativo) VALUES ($1, $2, $3, $4, TRUE)',
      [categoriaIds[categoria], nome, fornecedor, descricao],
    );
  }

  const roteiroIds = [];
  for (const roteiro of roteiros) {
    const result = await pool.query(
      `INSERT INTO roteiros
        (cliente_id, titulo, destino, data_ida, data_volta, status, data_aprovacao, valor_total, observacoes_cliente)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        clienteIds[roteiro.cliente],
        roteiro.titulo,
        roteiro.destino,
        roteiro.data_ida,
        roteiro.data_volta,
        roteiro.status,
        roteiro.status === 'aprovado' ? new Date() : null,
        roteiro.valor_total,
        roteiro.observacoes_cliente,
      ],
    );
    roteiroIds.push(result.rows[0].id);
  }

  for (let index = 0; index < etapasPorRoteiro.length; index += 1) {
    for (const etapa of etapasPorRoteiro[index]) {
      await pool.query(
        `INSERT INTO etapas_roteiro
          (roteiro_id, dia_numero, data, ordem, titulo, descricao, tipo, horario, voucher_codigo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          roteiroIds[index],
          etapa.dia,
          etapa.data,
          etapa.ordem,
          etapa.titulo,
          etapa.descricao,
          etapa.tipo,
          etapa.horario,
          etapa.voucher_codigo ?? null,
        ],
      );
    }
  }

  for (const lancamento of lancamentos) {
    await pool.query(
      `INSERT INTO lancamentos_financeiros
        (cliente_id, roteiro_id, categoria_id, item_comprado, valor_total_venda, comissao_liquida, data_venda, contrato_fechado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
      [
        clienteIds[lancamento.cliente],
        lancamento.roteiro === null ? null : roteiroIds[lancamento.roteiro],
        categoriaIds[lancamento.categoria],
        lancamento.item,
        lancamento.valor,
        lancamento.comissao,
        lancamento.data,
      ],
    );
  }
}

export async function initSchema() {
  await pool.query(DDL);
  await seed();
}
