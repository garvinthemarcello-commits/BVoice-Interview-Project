import { query } from '../_lib/db.js';
import { SELECT_WITH_DIVISION, mapCandidateRow } from '../_lib/candidates.js';
import { methodGuard, serverError } from '../_lib/http.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, 'GET')) return;

  try {
    const rows = await query.all(`${SELECT_WITH_DIVISION} ORDER BY c.full_name ASC`);
    const data = rows.map(mapCandidateRow);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    serverError(res, err);
  }
}
