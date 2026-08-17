/**
 * Express application setup.
 * Separated from server.js so it can be imported in tests without
 * starting the HTTP listener.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config/env');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

// ── Security & parsing middleware ─────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────────────────────────
app.use(requestLogger);

// ── Routes ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BVoice Radio API — see /api/health for status',
    docs: '/api',
  });
});

app.use('/api', apiRoutes);

// ── 404 & error handling (must be last) ───────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
