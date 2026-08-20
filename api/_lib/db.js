/**
 * Postgres connection pool, shared across serverless function invocations
 * within the same warm instance. Promise-based query helpers mirror the
 * old sqlite wrapper's shape (all/get/run) so controller logic ports over
 * with minimal changes.
 */

import pg from 'pg';

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('Missing POSTGRES_URL (or DATABASE_URL) environment variable');
    }

    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=') ? undefined : { rejectUnauthorized: false },
    });
  }

  return pool;
}

export const query = {
  /** SELECT many rows. */
  async all(sql, params = []) {
    const { rows } = await getPool().query(sql, params);
    return rows;
  },

  /** SELECT one row (or null). */
  async get(sql, params = []) {
    const { rows } = await getPool().query(sql, params);
    return rows[0] || null;
  },

  /** INSERT / UPDATE / DELETE. */
  async run(sql, params = []) {
    const result = await getPool().query(sql, params);
    return { rowCount: result.rowCount, rows: result.rows };
  },
};
