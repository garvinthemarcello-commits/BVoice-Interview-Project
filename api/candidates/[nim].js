import { query } from '../_lib/db.js';
import { SELECT_WITH_DIVISION, mapCandidateRow } from '../_lib/candidates.js';
import { methodGuard, notFound, serverError } from '../_lib/http.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, 'GET')) return;

  const { nim } = req.query;

  try {
    const row = await query.get(`${SELECT_WITH_DIVISION} WHERE c.nim = $1`, [nim]);

    if (!row) return notFound(res, `No candidate found for NIM "${nim}"`);

    res.status(200).json({ success: true, data: mapCandidateRow(row) });
  } catch (err) {
    serverError(res, err);
  }
}
