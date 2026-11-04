import express from 'express';
import { initDb, pool } from './db.js';
import { catalog } from './catalog.js';
import { initSchema } from './schema.js';
import { domainRouter } from './domain.js';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '20mb' }));
app.use('/api', domainRouter);

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'up' });
  } catch (error) {
    res.status(503).json({ status: 'degraded', db: 'down', error: error.message });
  }
});

app.get('/api/catalog', (_req, res) => {
  res.json(catalog);
});

app.post('/api/quotes', async (req, res) => {
  const body = req.body ?? {};
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const destination = String(body.destination ?? '').trim();
  const message = String(body.message ?? '').trim();
  const travelers = Number(body.travelers ?? 1);
  const travelDate = String(body.travelDate ?? '').trim();

  const errors = {};
  if (name.length < 2) errors.name = 'Informe seu nome completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Informe um e-mail válido.';
  if (!destination) errors.destination = 'Escolha o destino de interesse.';
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 20) {
    errors.travelers = 'Informe entre 1 e 20 viajantes.';
  }
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const result = await pool.query(
      `INSERT INTO quotes (name, email, phone, destination, travelers, travel_date, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [
        name,
        email,
        phone || null,
        destination,
        travelers,
        travelDate || null,
        message || null,
      ],
    );

    return res.status(201).json({
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at,
    });
  } catch (error) {
    console.error('quote insert failed:', error.message);
    return res.status(500).json({ error: 'Não foi possível registrar seu pedido agora.' });
  }
});

await initDb();
await initSchema();

app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on http://0.0.0.0:${port}`);
});
