/**
 * Division controller — business logic for /api/divisions.
 */

const { query } = require('../database');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/divisions
 * List all divisions.
 */
const getAllDivisions = asyncHandler(async (req, res) => {
  const rows = await query.all(
    `SELECT id, name, description, created_at
     FROM divisions
     ORDER BY id ASC`,
  );

  res.json({ success: true, count: rows.length, data: rows });
});

/**
 * GET /api/divisions/:id
 * Get a single division by ID.
 */
const getDivisionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const row = await query.get(
    `SELECT id, name, description, created_at
     FROM divisions
     WHERE id = ?`,
    [id],
  );

  if (!row) {
    const err = new Error(`Division with ID "${id}" not found`);
    err.status = 404;
    throw err;
  }

  res.json({ success: true, data: row });
});

module.exports = {
  getAllDivisions,
  getDivisionById,
};
