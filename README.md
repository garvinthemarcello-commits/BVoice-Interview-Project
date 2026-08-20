# BVoice Radio — Interview Results Site



## Architecture Overview

```
┌─────────────────────┐        HTTP (fetch)        ┌─────────────────────┐        SQL         ┌──────────────────┐
│      Frontend        │  ───────────────────────▶  │   API (serverless)   │  ───────────────▶  │     Database       │
│  React + TypeScript  │   GET /api/candidates/:nim │  Vercel functions     │   pg driver        │  Postgres           │
│  Vite + Tailwind     │  ◀───────────────────────  │  (Node.js)             │  ◀───────────────  │  candidates,       │
│  GSAP animations      │      JSON { success, data }│                       │   rows / joins      │  divisions tables  │
└─────────────────────┘                             └─────────────────────┘                     └──────────────────┘
```

Frontend and API are one Vercel project: the React app is a static build, and
each file under `api/` becomes its own serverless function. Everything is
same-origin, so the frontend just calls relative paths like
`/api/candidates/123` in both `vercel dev` and production — no proxy, no CORS
config needed.

## Tech Stack

| Layer     | Technology                                                            |
| --------- | ---------------------------------------------------------------------- |
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, GSAP (animations), lucide-react (icons) |
| API       | REST over HTTP, JSON, hand-rolled `fetch` client (no external HTTP lib) |
| Backend   | Vercel serverless functions (Node.js), one file per route             |
| Database  | Postgres (Neon / Vercel Postgres / Supabase), raw SQL via the `pg` driver |

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
├── api/                               # Backend (Vercel serverless functions)
│   ├── health.js                     # GET /api/health
│   ├── divisions/
│   │   ├── index.js                  # GET /api/divisions
│   │   └── [id].js                   # GET /api/divisions/:id
│   ├── candidates/
│   │   ├── index.js                  # GET /api/candidates
│   │   └── [nim].js                  # GET /api/candidates/:nim
│   └── _lib/                         # Shared code (not routable — underscore prefix)
│       ├── db.js                     # Postgres pool + Promise-based query helpers (all/get/run)
│       ├── candidates.js             # Shared SELECT + row-mapping for the candidates resource
│       └── http.js                   # methodGuard / notFound / serverError response helpers
│
├── db/
│   ├── schema.sql                    # Table DDL (divisions, candidates)
│   └── seed.js                       # Applies schema.sql, then populates divisions + sample candidates
│
└── vite.config.ts                    # Vite build config (no dev proxy needed — same-origin)
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
via the `notFound` / `serverError` helpers in `api/_lib/http.js`.

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
`mapCandidateRow()` (`api/_lib/candidates.js`) translates that into the public
shape above (`name`, `status: 'passed' | 'failed'`, nested `division` object)
so the frontend's contract stays stable regardless of internal schema changes.

## Backend

Each route is an independent serverless function — there's no shared server
process or middleware chain. A request to e.g. `/api/candidates/123` is routed
by Vercel directly to `api/candidates/[nim].js`, which:

```
handler(req, res)
  → methodGuard (only GET allowed → 405 otherwise)
  → query.get() from api/_lib/db.js (Postgres pool)
  → mapCandidateRow() shapes the response
  → notFound() (404) or serverError() (500) on failure
```

Files and folders under `api/_lib/` are not routable — the leading underscore
tells Vercel to treat them as shared code rather than an endpoint, which is
where the Postgres connection pool, query helpers, and response helpers live.

## Database

Postgres — connect via `POSTGRES_URL` (or `DATABASE_URL`), read by
`api/_lib/db.js` and `db/seed.js`. Any Postgres host works (Neon, Vercel
Postgres, Supabase); the connection pool is created lazily and reused across
warm invocations of the same function.

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
- `db/seed.js` (`npm run db:seed`) applies `schema.sql`, then wipes and
  repopulates both tables with the 6 fixed divisions and ~40 fake Indonesian
  candidate records (mixed passed/failed) for demo/testing purposes. A few
  short NIMs (`123`, `999`, `1234`, …) are kept at the top of the seed list
  for quick manual testing.

## Running Locally

```bash
npm install
cp .env.example .env      # set POSTGRES_URL to a Postgres instance (e.g. a free Neon project)
npm run db:seed           # apply schema + populate sample data
npx vercel dev             # runs the Vite frontend AND the /api functions together
```

Then open the printed local URL and try NIM `123` (passed → Marketing) or
`999` (failed) from the seed data.

> `npm run dev` (plain Vite) still works for frontend-only styling/animation
> work, but `/api/*` calls will 404 since Vite alone doesn't run the
> serverless functions — use `vercel dev` whenever you need working API calls.

### Environment Variables

| Variable       | Description                                          |
| -------------- | ----------------------------------------------------- |
| `POSTGRES_URL` | Postgres connection string (used by `api/` functions and `db/seed.js`) |

## Deploying

Push to GitHub, then import the repo in Vercel (vercel.com → New Project).
Vercel auto-detects the Vite build and the `api/` functions — no extra
config needed. Add `POSTGRES_URL` under the project's Environment Variables
before the first deploy, then run `npm run db:seed` once (locally, pointed
at the same `POSTGRES_URL`) to populate the live database.
