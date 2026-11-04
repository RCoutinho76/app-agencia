import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(here, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

export const domainRouter = express.Router();

domainRouter.use('/vouchers', express.static(uploadsDir));

domainRouter.get('/clientes', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.id,
             c.nome_completo,
             to_char(c.data_nascimento, 'YYYY-MM-DD') AS data_nascimento,
             c.cpf,
             c.celular,
             c.email,
             c.passaporte_numero,
             to_char(c.passaporte_validade, 'YYYY-MM-DD') AS passaporte_validade,
             c.vistos,
             c.observacoes,
             (SELECT COUNT(*)::int FROM roteiros r WHERE r.cliente_id = c.id) AS roteiros,
             COALESCE((SELECT SUM(l.valor_total_venda) FROM lancamentos_financeiros l WHERE l.cliente_id = c.id), 0)::float8 AS total_compras
      FROM clientes c
      ORDER BY c.nome_completo
    `);
    res.json(rows);
  } catch (error) {
    console.error('list clientes failed:', error.message);
    res.status(500).json({ error: 'Não foi possível carregar os clientes.' });
  }
});

domainRouter.get('/produtos', async (_req, res) => {
  try {
    const categorias = await pool.query(`
      SELECT cat.id,
             cat.nome,
             cat.descricao,
             cat.icone,
             cat.ordem,
             cat.ativo,
             (SELECT COUNT(*)::int FROM itens_produto i WHERE i.categoria_id = cat.id) AS itens
      FROM categorias_produto cat
      ORDER BY cat.ordem, cat.nome
    `);
    const itens = await pool.query(`
      SELECT i.id,
             i.categoria_id,
             cat.nome AS categoria_nome,
             i.nome,
             i.fornecedor,
             i.descricao,
             i.ativo
      FROM itens_produto i
      JOIN categorias_produto cat ON cat.id = i.categoria_id
      ORDER BY cat.ordem, i.nome
    `);
    res.json({ categorias: categorias.rows, itens: itens.rows });
  } catch (error) {
    console.error('list produtos failed:', error.message);
    res.status(500).json({ error: 'Não foi possível carregar os produtos.' });
  }
});

domainRouter.get('/roteiros', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.id,
             r.cliente_id,
             r.titulo,
             r.destino,
             to_char(r.data_ida, 'YYYY-MM-DD') AS data_ida,
             to_char(r.data_volta, 'YYYY-MM-DD') AS data_volta,
             r.imagem_capa,
             r.status,
             r.data_aprovacao,
             r.valor_total::float8 AS valor_total,
             r.observacoes_cliente,
             c.nome_completo AS cliente_nome,
             (SELECT COUNT(*)::int FROM etapas_roteiro e WHERE e.roteiro_id = r.id) AS etapas
      FROM roteiros r
      JOIN clientes c ON c.id = r.cliente_id
      ORDER BY r.data_ida DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('list roteiros failed:', error.message);
    res.status(500).json({ error: 'Não foi possível carregar os roteiros.' });
  }
});

domainRouter.get('/roteiros/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Roteiro inválido.' });
  }

  try {
    const roteiroResult = await pool.query(
      `SELECT r.id,
              r.cliente_id,
              r.titulo,
              r.destino,
              to_char(r.data_ida, 'YYYY-MM-DD') AS data_ida,
              to_char(r.data_volta, 'YYYY-MM-DD') AS data_volta,
              r.imagem_capa,
              r.status,
              r.data_aprovacao,
              r.valor_total::float8 AS valor_total,
              r.observacoes_cliente,
              c.nome_completo AS cliente_nome
       FROM roteiros r
       JOIN clientes c ON c.id = r.cliente_id
       WHERE r.id = $1`,
      [id],
    );

    if (roteiroResult.rowCount === 0) {
      return res.status(404).json({ error: 'Roteiro não encontrado.' });
    }

    const clienteResult = await pool.query(
      `SELECT id,
              nome_completo,
              to_char(data_nascimento, 'YYYY-MM-DD') AS data_nascimento,
              cpf,
              celular,
              email,
              passaporte_numero,
              to_char(passaporte_validade, 'YYYY-MM-DD') AS passaporte_validade,
              vistos,
              observacoes
       FROM clientes
       WHERE id = $1`,
      [roteiroResult.rows[0].cliente_id],
    );

    const etapasResult = await pool.query(
      `SELECT id,
              roteiro_id,
              dia_numero,
              to_char(data, 'YYYY-MM-DD') AS data,
              ordem,
              titulo,
              descricao,
              tipo,
              horario,
              imagem,
              voucher_url,
              voucher_codigo
       FROM etapas_roteiro
       WHERE roteiro_id = $1
       ORDER BY dia_numero, ordem, id`,
      [id],
    );

    res.json({
      roteiro: roteiroResult.rows[0],
      cliente: clienteResult.rows[0],
      etapas: etapasResult.rows,
    });
  } catch (error) {
    console.error('get roteiro failed:', error.message);
    res.status(500).json({ error: 'Não foi possível carregar o roteiro.' });
  }
});

domainRouter.get('/financeiro', async (_req, res) => {
  try {
    const resumoResult = await pool.query(`
      SELECT COALESCE(SUM(valor_total_venda), 0)::float8 AS faturamento_bruto,
             COALESCE(SUM(comissao_liquida), 0)::float8 AS comissoes_liquidas,
             COUNT(*)::int AS contratos,
             COALESCE(AVG(valor_total_venda), 0)::float8 AS ticket_medio
      FROM lancamentos_financeiros
      WHERE contrato_fechado = TRUE
    `);

    const porCategoriaResult = await pool.query(`
      SELECT cat.nome AS categoria,
             COALESCE(SUM(l.valor_total_venda), 0)::float8 AS faturamento,
             COALESCE(SUM(l.comissao_liquida), 0)::float8 AS comissoes
      FROM lancamentos_financeiros l
      JOIN categorias_produto cat ON cat.id = l.categoria_id
      WHERE l.contrato_fechado = TRUE
      GROUP BY cat.id, cat.nome
      ORDER BY comissoes DESC
    `);

    const lancamentosResult = await pool.query(`
      SELECT l.id,
             l.cliente_id,
             l.roteiro_id,
             l.categoria_id,
             l.item_comprado,
             l.valor_total_venda::float8 AS valor_total_venda,
             l.comissao_liquida::float8 AS comissao_liquida,
             to_char(l.data_venda, 'YYYY-MM-DD') AS data_venda,
             l.contrato_fechado,
             c.nome_completo AS cliente_nome,
             cat.nome AS categoria_nome
      FROM lancamentos_financeiros l
      JOIN clientes c ON c.id = l.cliente_id
      JOIN categorias_produto cat ON cat.id = l.categoria_id
      ORDER BY l.data_venda DESC, l.id DESC
    `);

    res.json({
      resumo: resumoResult.rows[0],
      por_categoria: porCategoriaResult.rows,
      lancamentos: lancamentosResult.rows,
    });
  } catch (error) {
    console.error('list financeiro failed:', error.message);
    res.status(500).json({ error: 'Não foi possível carregar o financeiro.' });
  }
});

const allowedExtensions = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.webp']);
const maxVoucherBytes = 10 * 1024 * 1024;

domainRouter.post('/etapas/:id/voucher', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Etapa inválida.' });
  }

  const nomeArquivo = String(req.body?.nome_arquivo ?? '');
  const extensao = path.extname(nomeArquivo).toLowerCase();
  if (!allowedExtensions.has(extensao)) {
    return res.status(422).json({ error: 'Envie um voucher em PDF, PNG, JPG ou WEBP.' });
  }

  const conteudo = String(req.body?.conteudo_base64 ?? '');
  if (!conteudo) {
    return res.status(422).json({ error: 'Selecione um arquivo para anexar.' });
  }

  const buffer = Buffer.from(conteudo, 'base64');
  if (buffer.length === 0) {
    return res.status(422).json({ error: 'O arquivo enviado está vazio.' });
  }
  if (buffer.length > maxVoucherBytes) {
    return res.status(413).json({ error: 'O voucher deve ter no máximo 10 MB.' });
  }

  try {
    const etapaResult = await pool.query('SELECT id FROM etapas_roteiro WHERE id = $1', [id]);
    if (etapaResult.rowCount === 0) {
      return res.status(404).json({ error: 'Etapa não encontrada.' });
    }

    const arquivo = `etapa-${id}-${Date.now()}${extensao}`;
    await fs.promises.writeFile(path.join(uploadsDir, arquivo), buffer);

    const voucherUrl = `/api/vouchers/${arquivo}`;
    const { rows } = await pool.query(
      'UPDATE etapas_roteiro SET voucher_url = $1 WHERE id = $2 RETURNING id, voucher_url, voucher_codigo',
      [voucherUrl, id],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('upload voucher failed:', error.message);
    res.status(500).json({ error: 'Não foi possível anexar o voucher.' });
  }
});
