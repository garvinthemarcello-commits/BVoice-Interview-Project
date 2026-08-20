# Project Interview IT WEB

A RESTful API for managing cacrew interview results, built with **Node.js**, **Express.js**, and **SQLite**.

## Folder Structure

```
backend/
├── src/
│   ├── server.js          # Application entry point (starts the HTTP server)
│   ├── app.js             # Express app configuration (middleware, routes, error handlers)
│   ├── config/
│   │   └── env.js         # Centralized environment-variable loader & validator
│   ├── database/
│   │   ├── index.js       # SQLite connection singleton (sqlite3, Promise-wrapped)
│   │   ├── schema.sql     # DDL: table definitions
│   │   └── seed.js        # Seeds the database with sample candidate data
│   ├── middleware/
│   │   ├── errorHandler.js    # Centralized JSON error responses
│   │   ├── notFound.js        # 404 handler for unknown routes
│   │   └── requestLogger.js   # Request logging (morgan-based)
│   ├── controllers/
│   │   ├── candidateController.js   # Business logic for candidates
│   │   └── divisionController.js    # Business logic for divisions
│   ├── routes/
│   │   ├── index.js              # Route aggregator mounted at /api
│   │   ├── candidateRoutes.js    # /api/candidates
│   │   └── divisionRoutes.js     # /api/divisions
│   └── utils/
│       └── asyncHandler.js   # Wraps async controllers to forward errors
├── data/                   # SQLite database file lives here (auto-created)
├── .env.example
└── package.json
```

## Getting Started

```bash
cd backend
npm install          # install dependencies
npm run db:seed      # (optional) seed sample candidate data
npm run dev          # start dev server with auto-reload
```

The API will be available at `http://localhost:5000`.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable       | Description                          | Default                |
| -------------- | ------------------------------------ | ---------------------- |
| `PORT`         | Port the server listens on           | `5000`                 |
| `NODE_ENV`     | Environment (`development`/`production`) | `development`      |
| `CLIENT_ORIGIN`| Allowed CORS origin for the frontend | `http://localhost:5173` |

## API Endpoints

### Health

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| GET    | `/api/health`| Server health check      |

### Candidates

| Method | Endpoint                  | Description                          |
| ------ | ------------------------- | ------------------------------------ |
| GET    | `/api/candidates`         | List all candidates (with division)  |
| GET    | `/api/candidates/:nim`    | Get a single candidate by NIM        |

### Divisions

| Method | Endpoint              | Description                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/api/divisions`      | List all divisions                   |
| GET    | `/api/divisions/:id`  | Get a single division by ID          |

## Example Response

`GET /api/candidates/123`

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

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **sqlite3** — SQLite driver, wrapped in Promises for async/await use
- **helmet** — Security headers
- **morgan** — HTTP request logging
- **dotenv** — Environment variable management
