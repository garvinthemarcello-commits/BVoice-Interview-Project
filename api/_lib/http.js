/**
 * Small helpers shared by every /api handler: consistent JSON envelopes,
 * a method guard, and a catch-all error responder.
 */

export function methodGuard(req, res, allowed) {
  if (req.method !== allowed) {
    res.setHeader('Allow', allowed);
    res.status(405).json({ success: false, error: { message: 'Method not allowed', code: 405 } });
    return false;
  }
  return true;
}

export function notFound(res, message) {
  res.status(404).json({ success: false, error: { message, code: 404 } });
}

export function serverError(res, err) {
  console.error(err);
  res.status(500).json({ success: false, error: { message: 'Internal server error', code: 500 } });
}
