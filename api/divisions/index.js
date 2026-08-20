import { query } from '../_lib/db.js';
import { methodGuard, serverError } from '../_lib/http.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, 'GET')) return;

  try {
    const rows = await query.all(
      `SELECT id, name, description, created_at FROM divisions ORDER BY id ASC`,
    );
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    serverError(res, err);
  }
}
