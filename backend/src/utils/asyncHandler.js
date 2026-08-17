/**
 * Wraps an async Express handler so rejected promises are forwarded
 * to next() and caught by the centralized error handler.
 *
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function} Express middleware
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
