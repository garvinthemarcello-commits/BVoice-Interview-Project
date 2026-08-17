-- BVoice Radio — Database Schema
-- Tables: divisions, candidates

-- ── Divisions ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS divisions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL UNIQUE,
  description TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── Candidates ───────────────────────────────────────────────────────────
-- Normalized: division references the divisions table via foreign key.

CREATE TABLE IF NOT EXISTS candidates (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  nim            TEXT    NOT NULL UNIQUE,
  full_name      TEXT    NOT NULL,
  email          TEXT,
  phone_number   TEXT,
  division_id    INTEGER,
  passed         INTEGER NOT NULL DEFAULT 0 CHECK (passed IN (0, 1)),
  interview_date TEXT,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (division_id) REFERENCES divisions (id)
);

-- Helpful indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_candidates_nim      ON candidates (nim);
CREATE INDEX IF NOT EXISTS idx_candidates_division ON candidates (division_id);
CREATE INDEX IF NOT EXISTS idx_candidates_passed   ON candidates (passed);
