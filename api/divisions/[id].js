import { query } from '../_lib/db.js';
import { methodGuard, notFound, serverError } from '../_lib/http.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, 'GET')) return;

  const { id } = req.query;

  try {
    const row = await query.get(
      `SELECT id, name, description, created_at FROM divisions WHERE id = $1`,
      [id],
    );

    if (!row) return notFound(res, `Division with ID "${id}" not found`);

    res.status(200).json({ success: true, data: row });
  } catch (err) {
    serverError(res, err);
  }
}
