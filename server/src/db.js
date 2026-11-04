import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function initDb(attempts = 20) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS quotes (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          destination TEXT NOT NULL,
          travelers INTEGER NOT NULL DEFAULT 1,
          travel_date DATE,
          message TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      console.warn(`database not ready (attempt ${attempt}): ${error.message}`);
      await sleep(2000);
    }
  }
}
