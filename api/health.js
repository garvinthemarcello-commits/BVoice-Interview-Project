import { methodGuard } from './_lib/http.js';

export default function handler(req, res) {
  if (!methodGuard(req, res, 'GET')) return;

  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
}
