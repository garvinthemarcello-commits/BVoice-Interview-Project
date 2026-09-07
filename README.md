# BVoice Radio — Interview Results Site



## Architecture Overview

```
┌─────────────────────┐        HTTP (fetch)        ┌─────────────────────┐        SQL         ┌──────────────────┐
│      Frontend        │  ───────────────────────▶  │        API           │  ───────────────▶  │     Database       │
│  React + TypeScript  │   GET /api/candidates/:nim │  PHP (plain scripts) │   PDO driver        │  MySQL              │
│  Vite + Tailwind     │  ◀───────────────────────  │  routed via .htaccess │  ◀───────────────  │  candidates,       │
│  GSAP animations      │      JSON { success, data }│                       │   rows / joins      │  divisions tables  │
└─────────────────────┘                             └─────────────────────┘                     └──────────────────┘
```

The frontend is a static Vite build that calls relative paths like
`/api/candidates/123`. In local dev those requests are proxied by Vite to an
Apache vhost (see `vite.config.ts` / `api/.htaccess`); in production
(Domainesia shared hosting) both the built frontend and the `api/` PHP
scripts are served by the same Apache instance, so it's same-origin there
too — no CORS config needed either way.

> This is the `php-mysql-migration` branch: a rewrite of the original
> Node/Vercel/Postgres backend to plain PHP + MySQL, targeting Domainesia
> shared cPanel hosting (which doesn't run Node or give you a Postgres
> instance). The original Vercel/Postgres implementation still lives on
> `master`.

## Tech Stack

| Layer     | Technology                                                            |
| --------- | ---------------------------------------------------------------------- |
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, GSAP (animations), lucide-react (icons) |
| API       | REST over HTTP, JSON, hand-rolled `fetch` client (no external HTTP lib) |
| Backend   | Plain PHP scripts (no framework), one file per route, routed via Apache `.htaccess` rewrites |
| Database  | MySQL, raw SQL via PDO                                                |

## Project Structure

```
gsapworking/
├── src/                              # Frontend (React + TS)
│   ├── App.tsx                       # Hash-based router + top-level layout
│   ├── main.tsx                      # React entry point
│   ├── lib/
│   │   ├── api.ts                    # API client — fetch wrapper for /api/*
│   │   └── useScrollReveal.ts        # Scroll-triggered reveal animation hook
│   ├── pages/
│   │   ├── LandingPage.tsx           # Hero + division info + contact
│   │   ├── ResultsPage.tsx           # "Passed" outcome — card reveal + division info
│   │   └── FailResultsPage.tsx       # "Not passed" outcome
│   └── components/
│       ├── Navbar.tsx / Footer.tsx
│       ├── Hero.tsx                  # Landing hero section
│       ├── CheckResultCard.tsx       # NIM input form, calls the API client
│       ├── CardRevealSequence.tsx    # GSAP shuffle animation
│       ├── DivisionSection.tsx       # Division grid (Announcer, Marketing, …)
│       └── ContactPerson.tsx
│
├── api/                               # Backend (plain PHP, routed via .htaccess)
│   ├── health.php                    # GET /api/health
│   ├── config.example.php            # Template for api/config.php (gitignored)
│   ├── divisions/
│   │   ├── index.php                 # GET /api/divisions
│   │   └── show.php                  # GET /api/divisions/:id  (?id=)
│   ├── candidates/
│   │   ├── index.php                 # GET /api/candidates
│   │   └── show.php                  # GET /api/candidates/:nim  (?nim=)
│   ├── .htaccess                     # Rewrites extensionless /api/* routes to the .php files above
│   └── _lib/                         # Shared code (not routable — underscore prefix)
│       ├── db.php                    # PDO MySQL connection + query helpers (all/get/run)
│       ├── candidates.php            # Shared SELECT + row-mapping for the candidates resource
│       └── http.php                  # methodGuard / notFound / serverError response helpers
│
├── db/
│   ├── schema.mysql.sql              # Table DDL (divisions, candidates) — MySQL
│   ├── schema.sql                    # Original Postgres DDL, kept for reference (master branch)
│   └── seed.php                      # Creates the DB if needed, applies schema.mysql.sql, seeds data
│
└── vite.config.ts                    # Dev-only proxy: /api/* → the local Apache vhost (see below)
```

## Frontend

**Routing.** There's no router library — `App.tsx` reads `window.location.hash`
directly (`routeFromHash`) and re-renders on `hashchange`. Three routes exist:
`#` (home / `LandingPage`), `#results/<division>` (`ResultsPage`), and
`#result-fail` (`FailResultsPage`).

**Result lookup flow:**
1. `CheckResultCard` (rendered on the landing page) takes a NIM and calls
   `getCandidateByNim(nim)` from `src/lib/api.ts`.
2. That hits `GET /api/candidates/:nim` via `fetch`. A `404` is treated as
   "no such candidate" (not an error); any other non-OK status throws.
3. On success: if `candidate.status === 'passed'` and a division is present,
   the app navigates to `#results/<division name>`; otherwise to `#result-fail`.
4. `ResultsPage` runs the `CardRevealSequence` animation (a `setTimeout`-choreographed
   card shuffle → flip, driven by React state and CSS transitions, to reveal the
   assigned division), then fades in the full `DivisionSection` grid once the
   reveal finishes. GSAP itself is only used for scroll-triggered fade-ins
   (`src/lib/useScrollReveal.ts`), not this reveal sequence.

## API Layer

Every endpoint responds with a consistent envelope: `{ success: boolean, data: ... }`
(list endpoints also include `count`); errors follow `{ success: false, error: { message, code } }`,
via the `notFound` / `serverError` helpers in `api/_lib/http.php`.

| Method | Endpoint                | Description                                  |
| ------ | ------------------------ | --------------------------------------------- |
| GET    | `/api/health`            | Liveness check — status, timestamp            |
| GET    | `/api/candidates`        | List all candidates, joined with their division |
| GET    | `/api/candidates/:nim`   | Look up a single candidate by NIM (404 if not found) |
| GET    | `/api/divisions`         | List all divisions                            |
| GET    | `/api/divisions/:id`     | Get a single division by ID                   |

Example — `GET /api/candidates/123`:

```json
{
  "success": true,
  "data": {
    "nim": "123",
    "name": "Andi Pratama",
    "email": "andi.pratama@binus.ac.id",
    "status": "passed",
    "division": {
      "id": 2,
      "name": "Marketing",
      "description": "Building the brand, reaching audiences, and driving creative campaigns."
    }
  }
}
```

The database stores `full_name` / `passed` (boolean) / `division_id`, but
`mapCandidateRow()` (`api/_lib/candidates.php`) translates that into the public
shape above (`name`, `status: 'passed' | 'failed'`, nested `division` object)
so the frontend's contract stays stable regardless of internal schema changes.

## Backend

There's no framework and no shared server process — each route is a plain PHP
script, reached via an Apache rewrite. A request to e.g. `/api/candidates/123`
is rewritten by `api/.htaccess` to `candidates/show.php?nim=123`, which:

```
show.php
  → methodGuard() (only GET allowed → 405 otherwise)
  → Query::get() from api/_lib/db.php (PDO MySQL)
  → mapCandidateRow() shapes the response
  → notFound() (404) or serverError() (500) on failure
```

Files and folders under `api/_lib/` are not routable (no rewrite rule points
at them) — that's where the PDO connection, query helpers, and response
helpers live. `api/config.php` (gitignored; copy from `api/config.example.php`)
holds the MySQL host/name/user/pass — Domainesia (and cPanel MySQL generally)
uses discrete credentials rather than a single connection string.

## Database

MySQL, connected via PDO using the credentials in `api/config.php`.

**Schema:**

```
divisions                          candidates
┌───────────────────┐              ┌────────────────────────┐
│ id (PK)            │◀────────────│ division_id (FK, null)  │
│ name (unique)       │             │ id (PK)                 │
│ description         │             │ nim (unique)             │
│ created_at          │             │ full_name                │
└───────────────────┘              │ email                    │
                                    │ phone_number              │
                                    │ passed (boolean)           │
                                    │ interview_date             │
                                    │ created_at / updated_at    │
                                    └────────────────────────┘
```

- `candidates.division_id` is a nullable FK to `divisions.id` — a rejected
  candidate (`passed = false`) has `division_id = NULL`.
- Indexes exist on `candidates.nim`, `candidates.division_id`, and
  `candidates.passed` for fast lookups (the NIM lookup is the hot path).
- `db/seed.php` (`php db/seed.php`) creates the database if it doesn't exist,
  applies `db/schema.mysql.sql`, then wipes and repopulates both tables with
  the 6 fixed divisions and ~40 fake Indonesian candidate records (mixed
  passed/failed) for demo/testing purposes. A few short NIMs (`123`, `999`,
  `1234`, …) are kept at the top of the seed list for quick manual testing.
- **Domainesia production note:** the real production database on Domainesia
  is an existing, differently-structured MySQL DB owned by a coworker.
  `db/schema.mysql.sql` and the seed data are only the local-dev reference
  schema — the queries in `api/_lib/` will need a follow-up pass once that
  real production structure is known.

## Running Locally

This branch needs Apache + PHP + MySQL, not a Node backend. The simplest way
on Windows is XAMPP.

1. **Install/open [XAMPP](https://www.apachefriends.org/)** and start the
   **Apache** and **MySQL** modules from the XAMPP Control Panel.
2. **Add a vhost** for the API so Apache serves `api/` on its own port,
   matching what `vite.config.ts` proxies to. Add this to
   `xampp/apache/conf/extra/httpd-vhosts.conf` (adjust the path to wherever
   you cloned the repo):
   ```apacheconf
   <VirtualHost *:8080>
       DocumentRoot "C:/path/to/gsapworking/api"
       ServerName bvoice-api.local
       <Directory "C:/path/to/gsapworking/api">
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```
   Make sure `Listen 8080` is enabled in `xampp/apache/conf/httpd.conf` (or
   in `httpd-ssl.conf` if you'd rather use a different port — just keep it in
   sync with the `target` in `vite.config.ts`'s proxy config), then restart
   Apache.
3. **Set up the database:**
   ```bash
   cp api/config.example.php api/config.php   # fill in your local MySQL credentials
   php db/seed.php                             # creates the DB, applies schema, seeds data
   ```
4. **Run the frontend:**
   ```bash
   npm install
   npm run dev
   ```

Then open the printed local URL (typically `http://localhost:5173`) and try
NIM `123` (passed → Marketing) or `999` (failed) from the seed data.

You can sanity-check the PHP side directly without going through Vite:
`curl http://localhost:8080/health.php` should return
`{"success":true,"data":{"status":"ok", ...}}`.

### Environment / Config

Unlike the Postgres branch, there's no `.env` file — MySQL credentials live
in `api/config.php` (gitignored, copy from `api/config.example.php`):

| Key    | Description                          |
| ------ | -------------------------------------- |
| `host` | MySQL host (`localhost` for XAMPP)     |
| `name` | Database name (`bvoice_radio`)         |
| `user` | MySQL user (`root` for XAMPP)          |
| `pass` | MySQL password (empty for XAMPP default) |

## Deploying (Domainesia)

1. Build the frontend: `npm run build` (outputs to `dist/`).
2. Upload `dist/`'s contents and the `api/` folder to the hosting account
   (e.g. `dist/` → `public_html/`, `api/` → `public_html/api/`), preserving
   `api/.htaccess`.
3. Create `api/config.php` on the server (from `api/config.example.php`)
   with the real cPanel MySQL host/name/user/pass.
4. Point the production database queries at the actual Domainesia schema —
   see the production note under **Database** above; this repo's
   `db/schema.mysql.sql` is the local-dev schema only, not what's live.
5. Confirm `mod_rewrite` is enabled and `.htaccess` overrides are allowed on
   the host (most shared cPanel hosts, Domainesia included, allow this by
   default) so the extensionless `/api/*` routes resolve.
