-- BVoice Radio — Database Schema (MySQL)
-- Tables: divisions, candidates
-- This is our own reference schema (translated 1:1 from db/schema.sql, the
-- Postgres original) for local dev. Domainesia's actual production database
-- is an existing, differently-structured MySQL DB owned by a coworker —
-- api/_lib queries will need a follow-up pass once that real structure is known.

-- ── Divisions ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS divisions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL UNIQUE,
  description TEXT         NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Candidates ───────────────────────────────────────────────────────────
-- Normalized: division references the divisions table via foreign key.

CREATE TABLE IF NOT EXISTS candidates (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nim            VARCHAR(255) NOT NULL UNIQUE,
  full_name      VARCHAR(255) NOT NULL,
  email          VARCHAR(255),
  phone_number   VARCHAR(50),
  division_id    INT,
  passed         BOOLEAN      NOT NULL DEFAULT FALSE,
  interview_date DATETIME,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_candidates_division FOREIGN KEY (division_id) REFERENCES divisions (id)
) ENGINE=InnoDB;

-- Helpful indexes for common lookups
CREATE INDEX idx_candidates_nim      ON candidates (nim);
CREATE INDEX idx_candidates_division ON candidates (division_id);
CREATE INDEX idx_candidates_passed   ON candidates (passed);
