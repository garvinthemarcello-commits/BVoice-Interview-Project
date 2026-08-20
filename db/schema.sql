-- BVoice Radio — Database Schema (Postgres)
-- Tables: divisions, candidates

-- ── Divisions ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS divisions (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL UNIQUE,
  description TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Candidates ───────────────────────────────────────────────────────────
-- Normalized: division references the divisions table via foreign key.

CREATE TABLE IF NOT EXISTS candidates (
  id             SERIAL PRIMARY KEY,
  nim            TEXT        NOT NULL UNIQUE,
  full_name      TEXT        NOT NULL,
  email          TEXT,
  phone_number   TEXT,
  division_id    INTEGER     REFERENCES divisions (id),
  passed         BOOLEAN     NOT NULL DEFAULT false,
  interview_date TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_candidates_nim      ON candidates (nim);
CREATE INDEX IF NOT EXISTS idx_candidates_division ON candidates (division_id);
CREATE INDEX IF NOT EXISTS idx_candidates_passed   ON candidates (passed);
