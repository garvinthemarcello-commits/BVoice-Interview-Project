/**
 * Centralized error handler.
 * Converts any Error into a consistent JSON response.
 *
 * Usage: app.use(errorHandler)  — must be the last middleware.
 */
function errorHandler(err, req, res, next) {
  console.error(`[error] ${err.message}`);

  const status = err.status || 500;
  const response = {
    success: false,
    error: {
      message: status < 500 ? err.message : 'Internal server error',
      code: status,
    },
  };

  // Include the stack trace in development for easier debugging
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
}

module.exports = errorHandler;
