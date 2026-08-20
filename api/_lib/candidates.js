/**
 * Shared query + mapping logic for the candidates resource.
 * The database schema uses full_name / passed / division_id, but the public
 * API keeps the original response shape (name, status, division object) so
 * the frontend is unaffected.
 */

export const SELECT_WITH_DIVISION = `
  SELECT
    c.nim, c.full_name, c.email, c.passed, c.phone_number,
    c.interview_date, c.created_at, c.updated_at,
    d.id   AS division_id,
    d.name AS division_name,
    d.description AS division_description
  FROM candidates c
  LEFT JOIN divisions d ON c.division_id = d.id
`;

export function mapCandidateRow(r) {
  return {
    nim: r.nim,
    name: r.full_name,
    email: r.email,
    status: r.passed ? 'passed' : 'failed',
    division: r.division_id
      ? {
          id: r.division_id,
          name: r.division_name,
          description: r.division_description,
        }
      : null,
  };
}
