/**
 * Route aggregator — all API routes mounted under /api.
 */

const express = require('express');
const candidateRoutes = require('./candidateRoutes');
const divisionRoutes = require('./divisionRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// Resource routes
router.use('/candidates', candidateRoutes);
router.use('/divisions',  divisionRoutes);

module.exports = router;
