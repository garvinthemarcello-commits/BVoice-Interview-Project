/**
 * Candidate controller — business logic for /api/candidates.
 *
 * The database schema uses full_name / passed / division_id, but the public
 * API keeps the original response shape (name, status, division object) so
 * the frontend is unaffected.
 */

const { query } = require('../database');
const asyncHandler = require('../utils/asyncHandler');

const SELECT_WITH_DIVISION = `
  SELECT
    c.nim, c.full_name, c.email, c.passed, c.phone_number,
    c.interview_date, c.created_at, c.updated_at,
    d.id   AS division_id,
    d.name AS division_name,
    d.description AS division_description
  FROM candidates c
  LEFT JOIN divisions d ON c.division_id = d.id
`;

/** Map a raw DB row to the public API candidate object. */
function mapRow(r) {
  return {
    nim:   r.nim,
    name:  r.full_name,
    email: r.email,
    status: r.passed ? 'passed' : 'failed',
    division: r.division_id
      ? {
          id:          r.division_id,
          name:        r.division_name,
          description: r.division_description,
        }
      : null,
  };
}

/**
 * GET /api/candidates
 * List all candidates, joined with their division.
 */
const getAllCandidates = asyncHandler(async (req, res) => {
  const rows = await query.all(
    `${SELECT_WITH_DIVISION} ORDER BY c.full_name ASC`,
  );

  const data = rows.map(mapRow);

  res.json({ success: true, count: data.length, data });
});

/**
 * GET /api/candidates/:nim
 * Get a single candidate by NIM, with division details.
 */
const getCandidateByNim = asyncHandler(async (req, res) => {
  const { nim } = req.params;

  const row = await query.get(`${SELECT_WITH_DIVISION} WHERE c.nim = ?`, [nim]);

  if (!row) {
    const err = new Error(`No candidate found for NIM "${nim}"`);
    err.status = 404;
    throw err;
  }

  res.json({ success: true, data: mapRow(row) });
});

module.exports = {
  getAllCandidates,
  getCandidateByNim,
};
