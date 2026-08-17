/**
 * Centralized environment configuration.
 * Loads .env once and exposes a validated config object.
 */

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
};

module.exports = config;
