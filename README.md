# BVoice Radio — Interview Results Site



## Architecture Overview

```
┌─────────────────────┐        HTTP (fetch)        ┌─────────────────────┐        SQL         ┌──────────────────┐
│      Frontend        │  ───────────────────────▶  │      Backend API     │  ───────────────▶  │     Database       │
│  React + TypeScript  │   GET /api/candidates/:nim │  Node.js + Express   │   sqlite3 driver   │  SQLite (file)     │
│  Vite + Tailwind     │  ◀───────────────────────  │                       │  ◀───────────────  │  candidates,       │
│  GSAP animations      │      JSON { success, data }│                       │   rows / joins      │  divisions tables  │
└─────────────────────┘                             └─────────────────────┘                     └──────────────────┘
        │                                                      │
        │ dev: Vite proxy rewrites /api  ─────────────────────▶│ listens on :5000
        │      requests to http://localhost:5000                │
        ▼                                                      ▼
   http://localhost:5173                                 backend/data/bvoice.db
```

In development, the Vite dev server (port `5173`) proxies any request to
`/api/*` straight through to the Express server on port `5000`
(`vite.config.ts`), so the frontend never needs to know the backend's real
host — it just calls relative paths like `/api/candidates/123`.

## Tech Stack

| Layer     | Technology                                                            |
| --------- | ---------------------------------------------------------------------- |
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, GSAP (animations), lucide-react (icons) |
| API       | REST over HTTP, JSON, hand-rolled `fetch` client (no external HTTP lib) |
| Backend   | Node.js, Express 4, Helmet (security headers), CORS, Morgan (logging)  |
| Database  | SQLite (file-based), raw SQL via the `sqlite3` driver with a small Promise wrapper |

## Project Structure

```
gsapworking/
├── src/                              # Frontend (React + TS)
│   ├── App.tsx                       # Hash-based router + top-level layout
│   ├── main.tsx                      # React entry point
│   ├── lib/
│   │   ├── api.ts                    # API client — fetch wrapper for the backend
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
├── backend/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── server.js                 # HTTP entry point — starts the listener
│   │   ├── app.js                    # Express app: middleware, routing, error handling
│   │   ├── config/env.js             # Loads & validates environment variables
│   │   ├── routes/                   # index.js aggregates candidateRoutes + divisionRoutes under /api
│   │   ├── controllers/              # candidateController.js, divisionController.js — query DB, shape responses
│   │   ├── middleware/               # requestLogger, notFound (404), errorHandler
│   │   ├── utils/asyncHandler.js     # Wraps async route handlers so thrown errors reach errorHandler
│   │   └── database/
│   │       ├── index.js              # SQLite connection + Promise-based query helpers (all/get/run)
│   │       ├── schema.sql            # Table DDL (divisions, candidates)
│   │       └── seed.js               # Populates divisions + sample candidates
│   └── data/bvoice.db                # SQLite database file (created/used at runtime)
│
└── vite.config.ts                    # Dev server + /api proxy to http://localhost:5000
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

All endpoints are mounted under `/api` (see `backend/src/routes/index.js`) and
respond with a consistent envelope: `{ success: boolean, data: ... }` (list
endpoints also include `count`). Errors follow the same shape via
`middleware/errorHandler.js`, with the HTTP status set from `err.status`
(defaults to `500`).

| Method | Endpoint                | Description                                  |
| ------ | ------------------------ | --------------------------------------------- |
| GET    | `/api/health`            | Liveness check — status, timestamp, uptime    |
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

The database stores `full_name` / `passed` (0 or 1) / `division_id`, but
`candidateController.mapRow()` translates that into the public shape above
(`name`, `status: 'passed' | 'failed'`, nested `division` object) so the
frontend's contract stays stable regardless of internal schema changes.

## Backend

Request flow through `backend/src/app.js`:

```
request
  → helmet (security headers)
  → cors (restricts origin to CLIENT_ORIGIN)
  → express.json / urlencoded (body parsing)
  → requestLogger (morgan)
  → /api routes  → router (routes/*.js) → controller (controllers/*.js) → database/index.js query()
  → notFound (unmatched routes → 404)
  → errorHandler (uncaught / thrown errors → JSON error response)
```

Controllers never touch the `sqlite3` driver directly — they call the
`query.all / query.get / query.run` helpers exported from
`database/index.js`, which wrap the callback-based `sqlite3` API in Promises
so route handlers can use plain `async/await`. Route handlers are wrapped in
`asyncHandler`, which forwards any rejected promise to Express's error
pipeline instead of requiring a `try/catch` in every controller.

## Database

SQLite, file-based, stored at `backend/data/bvoice.db` (auto-created on first
run via `initSchema()` in `database/index.js`, which executes `schema.sql`).
WAL journal mode and foreign keys are enabled via `PRAGMA` on connect.

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
                                    │ passed (0/1)               │
                                    │ interview_date             │
                                    │ created_at / updated_at    │
                                    └────────────────────────┘
```

- `candidates.division_id` is a nullable FK to `divisions.id` — a rejected
  candidate (`passed = 0`) has `division_id = NULL`.
- Indexes exist on `candidates.nim`, `candidates.division_id`, and
  `candidates.passed` for fast lookups (the NIM lookup is the hot path).
- `backend/src/database/seed.js` (`npm run db:seed`) wipes and repopulates
  both tables with the 6 fixed divisions and ~40 fake Indonesian candidate
  records (mixed passed/failed) for demo/testing purposes. A few short NIMs
  (`123`, `999`, `1234`, …) are kept at the top of the seed list for quick
  manual testing.

## Running Locally

**Backend** (port `5000`):
```bash
cd backend
npm install
cp .env.example .env      # adjust PORT / CLIENT_ORIGIN if needed
npm run db:seed           # populate sample data (optional but recommended)
npm run dev                # starts with nodemon auto-reload
```

**Frontend** (port `5173`, proxies `/api` to the backend above):
```bash
npm install
npm run dev
```

Then open `http://localhost:5173` and try NIM `123` (passed → Marketing) or
`999` (failed) from the seed data.

### Environment Variables (backend)

| Variable        | Description                              | Default                  |
| ---------------- | ----------------------------------------- | ------------------------- |
| `PORT`           | Port the Express server listens on        | `5000`                    |
| `NODE_ENV`       | `development` / `production`              | `development`              |
| `CLIENT_ORIGIN`  | Allowed CORS origin for the frontend       | `http://localhost:5173`    |
