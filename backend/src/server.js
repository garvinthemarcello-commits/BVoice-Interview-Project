/**
 * HTTP server entry point.
 * Loads the Express app and starts listening on the configured port.
 */

const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () => {
  console.log(`
  ┌──────────────────────────────────────────────────┐
  │  BVoice Radio API                                │
  │  Environment: ${config.nodeEnv.padEnd(27)}          │
  │  Listening:   http://localhost:${config.port}           │
  │  Health:      http://localhost:${config.port}/api/health  │
  └──────────────────────────────────────────────────┘
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully…');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received — shutting down gracefully…');
  server.close(() => process.exit(0));
});

module.exports = server;
